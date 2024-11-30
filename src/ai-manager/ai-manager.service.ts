import { HttpException, Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { AiGeminiService } from './ai-models-services/gemini.service';
import { AiGptService } from './ai-models-services/gpt.service';
import { BalanceService } from 'src/balance/balance.service';

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

  private models: Map<string, AiGptService | AiGeminiService> = new Map();
  private activeStreams: Map<string, Subject<void>> = new Map();

  async generateStream(
    userId: number,
    message: string,
    model: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const streamId = `${Date.now()}`;
    this.activeStreams.set(streamId, new Subject<void>());
    const abortSignal = this.activeStreams.get(streamId);

    try {
      const balance = await this.balanceHandler.getBalance(userId);
      if (balance.value <= 0) {
        throw new HttpException('Your balance is less than 0', 403);
      }

      const modelService = this.models.get(model);
      if (!modelService) {
        throw new HttpException('Model not found', 404);
      }

      await modelService.generateStream(
        message,
        (chunk) => {
          if (abortSignal.closed) {
            throw new Error('Stream aborted by client');
          }
          onChunk(chunk);
        },
        (cost) => {
          this.balanceHandler.aiTokenBuy(userId, cost);
        },
        abortSignal,
      );
    } finally {
      abortSignal.next();
      abortSignal.complete();
      this.activeStreams.delete(streamId);
    }
  }

  abortStream(streamId: string): void {
    const abortSignal = this.activeStreams.get(streamId);
    if (abortSignal) {
      abortSignal.next();
      abortSignal.complete();
    }
  }
}
