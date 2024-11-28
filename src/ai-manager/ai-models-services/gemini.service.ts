import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

@Injectable()
export class AiGeminiService {
  async generateStream(
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const response = await model.generateContentStream(prompt);

    for await (const chunk of response.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  }
}
