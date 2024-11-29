import {
  Body,
  Controller,
  Logger,
  Post,
  Sse,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AiManagerService } from './ai-manager.service';
import { ReqMessageDto } from './dto/req-message.dto';
import { SseUserGuard } from 'src/auth/sse-user.guard';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('ИИ менеджер')
@Controller('ai')
export class AiManagerController {
  private readonly logger = new Logger(AiManagerController.name);

  constructor(private readonly aiService: AiManagerService) {}

  @ApiOperation({ summary: 'Отправка промпта с моделью' })
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiResponse({ status: 200, example: { streamId: '5-1732887598350' } })
  @ApiResponse({ status: 404, example: 'Model not found' })
  @ApiResponse({ status: 403, example: 'Your balance is less than 0' })
  @ApiResponse({ status: 400, example: 'Stream already in progress' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Post('generate')
  generate(@Body() dto: ReqMessageDto) {
    return this.aiService.generate(dto);
  }

  @ApiOperation({ summary: 'Получение ответа с SSE' })
  @ApiQuery({ name: 'streamId', example: '5-1732887598350', required: true })
  @ApiQuery({ name: 'token', example: 'token', required: true })
  @ApiResponse({ status: 200, example: { data: 'chunk' } })
  @ApiResponse({ status: 404, example: 'Stream not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(SseUserGuard)
  @Sse('stream')
  stream(@Query('streamId') streamId: string) {
    return this.aiService.getStream(streamId);
  }
}
