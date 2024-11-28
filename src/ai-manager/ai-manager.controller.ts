import { Body, Controller, Logger, Post, Sse, Query } from '@nestjs/common';
import { AiManagerService } from './ai-manager.service';
import { ReqMessageDto } from './dto/req-message.dto';

@Controller('ai')
export class AiManagerController {
  private readonly logger = new Logger(AiManagerController.name);

  constructor(private readonly aiService: AiManagerService) {}

  @Post('generate')
  generate(@Body() dto: ReqMessageDto) {
    return this.aiService.generate(dto);
  }

  @Sse('stream')
  stream(@Query('streamId') streamId: string) {
    return this.aiService.getStream(streamId);
  }
}
