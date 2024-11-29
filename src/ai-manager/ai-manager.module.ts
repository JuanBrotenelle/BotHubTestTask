import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiGeminiService } from './ai-models-services/gemini.service';
import { AiGptService } from './ai-models-services/gpt.service';
import { AiManagerController } from './ai-manager.controller';
import { BalanceModule } from 'src/balance/balance.module';
import { AiManagerService } from './ai-manager.service';
import { CountTokenCost } from './token-cost.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, BalanceModule, AuthModule],
  controllers: [AiManagerController],
  providers: [AiManagerService, AiGeminiService, AiGptService, CountTokenCost],
})
export class AiManagerModule {}
