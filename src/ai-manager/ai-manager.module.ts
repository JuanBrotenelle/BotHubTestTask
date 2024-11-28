import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiManagerController } from './ai-manager.controller';
import { AiManagerService } from './ai-manager.service';
import { AiGeminiService } from './ai-models-services/gemini.service';
import { AiGptService } from './ai-models-services/gpt.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' })],
  controllers: [AiManagerController],
  providers: [AiManagerService, AiGeminiService, AiGptService],
})
export class AiManagerModule {}
