import { Body, Controller, Post, Res, UseGuards, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AiManagerService } from './ai-manager.service';
import { ReqMessageDto } from './dto/req-message.dto';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('ИИ менеджер')
@Controller('ai')
export class AiManagerController {
  private readonly logger = new Logger(AiManagerController.name);

  constructor(private readonly aiService: AiManagerService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Отправка промпта с моделью и получение ответа в реальном времени',
  })
  @ApiResponse({ status: 200, description: 'Стрим ответа' })
  @ApiResponse({ status: 403, example: 'Your balance is less than 0' })
  @ApiResponse({ status: 404, example: 'Model not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Post('generate-stream')
  async generateStream(
    @Body() dto: ReqMessageDto,
    @Res() res: Response,
    @Res() req: Response,
  ): Promise<void> {
    const streamId = `${Date.now()}`;

    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      req.on('close', () => {
        this.logger.warn(`Stream ${streamId} aborted`);
        this.aiService.abortStream(streamId);
        res.end();
      });

      await this.aiService.generateStream(
        dto.userId,
        dto.message,
        dto.model,
        (chunk) => {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        },
      );

      res.end();
    } catch (error) {
      this.logger.error(`Stream error: ${error.message}`);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`,
      );
      res.end();
    }
  }
}
