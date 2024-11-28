import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY,
  baseURL: 'https://bothub.chat/api/v2/openai/v1',
});

@Injectable()
export class AiGptService {
  async generateStream(
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        const content = chunk.choices[0].delta.content;
        onChunk(content);
      }
    }
  }
}
