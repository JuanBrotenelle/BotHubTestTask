import { HttpException, Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { AiGeminiService } from './ai-models-services/gemini.service';
import { AiGptService } from './ai-models-services/gpt.service';
import { BalanceService } from 'src/balance/balance.service';
import { ReqMessageDto } from './dto/req-message.dto';

@Injectable()
export class AiManagerService {
  constructor(
    private readonly gptService: AiGptService,
    private readonly geminiService: AiGeminiService,
    private readonly balanceHandler: BalanceService,
  ) {
    this.models.set('gpt', this.gptService);
    this.models.set('gemini', this.geminiService);
  }

  private streams: Map<string, Subject<MessageEvent>> = new Map();
  private models: Map<string, AiGptService | AiGeminiService> = new Map();

  async generate(dto: ReqMessageDto): Promise<{ streamId: string }> {
    const balance = await this.balanceHandler.getBalance(dto.userId);

    if (balance.value <= 0) {
      throw new HttpException('Your balance is less than 0', 403);
    }

    const streamId = `${dto.userId}-${Date.now()}`;
    const stream$ = new Subject<MessageEvent>();

    if (this.streams.has(streamId)) {
      throw new HttpException('Stream already in progress', 400);
    }

    if (!this.models.has(dto.model)) {
      throw new HttpException('Model not found', 404);
    }

    this.streams.set(streamId, stream$);
    this.processGeneration(streamId, dto.message, dto.model);

    return { streamId };
  }

  getStream(streamId: string): Observable<MessageEvent> {
    const stream$ = this.streams.get(streamId);
    if (!stream$) {
      throw new HttpException('Stream not found', 404);
    }
    return stream$.asObservable();
  }

  private async processGeneration(
    streamId: string,
    message: string,
    model: string,
  ): Promise<void> {
    const stream$ = this.streams.get(streamId);
    if (!stream$) return;

    try {
      await this.generateSse(
        model,
        message,
        (chunk) => {
          stream$.next(new MessageEvent('message', { data: chunk }));
        },
        (cost) => {
          this.balanceHandler.aiTokenBuy(streamId, cost);
        },
      );
    } catch (error) {
      stream$.error(error);
    } finally {
      stream$.complete();
      this.streams.delete(streamId);
    }
  }

  private async generateSse(
    modelName: string,
    prompt: string,
    onChunk: (chunk: string) => void,
    countCost: (cost: number) => void,
  ): Promise<void> {
    const model = this.models.get(modelName);

    if (!model) {
      throw new HttpException('Model not supported', 501);
    }

    await model.generateStream(prompt, onChunk, countCost);
  }
}
