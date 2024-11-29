import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CountTokenCost } from '../token-cost.service';
import { encoding_for_model } from '@dqbd/tiktoken';

@Injectable()
export class AiGptService {
  constructor(
    private configService: ConfigService,
    private tokenHandler: CountTokenCost,
  ) {}

  private readonly model = 'gpt-4o';
  private readonly price = 0.2;

  async generateStream(
    prompt: string,
    onChunk: (chunk: string) => void,
    countCost: (cost: number) => void,
  ): Promise<void> {
    const inputTokens = await this.tokenHandler.countTokens(prompt, this.model);

    const openai = new OpenAI({
      apiKey: process.env.GPT_API_KEY,
      baseURL: 'https://bothub.chat/api/v2/openai/v1',
    });

    const stream = await openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      stream_options: { include_usage: true },
    });

    const tempContentArray = [];

    try {
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          const content = chunk.choices[0].delta.content;

          onChunk(content);
          tempContentArray.push(content);
        }
      }
    } finally {
      stream.tee();
    }

    let totalOutputTokens = 0;

    for (const content in tempContentArray) {
      totalOutputTokens += this.tokenHandler.countTokens(content, this.model);
    }

    const totalTokens = totalOutputTokens + inputTokens;

    const totalCost = this.tokenHandler.calculateCost(totalTokens, this.price);

    countCost(totalCost);
  }
}
