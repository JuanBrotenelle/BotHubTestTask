import { Injectable } from '@nestjs/common';
import { encoding_for_model, TiktokenModel } from '@dqbd/tiktoken';

@Injectable()
export class CountTokenCost {
  countTokens(text: string, model: TiktokenModel): number {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input text for tokenization.');
    }
    const encoding = encoding_for_model(model);
    try {
      return encoding.encode(text).length;
    } finally {
      encoding.free();
    }
  }

  calculateCost(tokens: number, pricePerToken: number): number {
    return Math.ceil(tokens * pricePerToken);
  }
}
