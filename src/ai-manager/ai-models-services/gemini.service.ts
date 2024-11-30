import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CountTokenCost } from '../token-cost.service';
import { Subject } from 'rxjs';

@Injectable()
export class AiGeminiService {
  constructor(
    private configService: ConfigService,
    private tokenHandler: CountTokenCost,
  ) {}

  private readonly model = 'gemini-1.5-flash';
  private readonly price = 0.1;

  async generateStream(
    prompt: string,
    onChunk: (chunk: string) => void,
    countCost: (cost: number) => void,
    abortSignal: Subject<void>,
  ): Promise<void> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const ai = genAI.getGenerativeModel({ model: this.model });

    const tokenCountResult = await ai.countTokens(prompt);
    const inputTokens = tokenCountResult.totalTokens;

    const generalResult = await ai.generateContentStream(prompt);

    let isAborted = false;

    const abortSubscription = abortSignal.subscribe(() => {
      isAborted = true;
    });

    let outputTokens = 0;

    try {
      for await (const chunk of generalResult.stream) {
        if (isAborted) {
          break;
        }
        const chunkText = chunk.text();

        const chunkTokensResult = await ai.countTokens(chunkText);
        outputTokens += chunkTokensResult.totalTokens;

        onChunk(chunkText);
      }
    } finally {
      abortSubscription.unsubscribe();
    }

    const totalTokens = inputTokens + outputTokens;
    countCost(this.tokenHandler.calculateCost(totalTokens, this.price));
  }
}
