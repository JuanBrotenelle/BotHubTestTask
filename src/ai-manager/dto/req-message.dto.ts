import { ApiProperty } from '@nestjs/swagger';
import { AiModels } from '../enum/models.enum';

export class ReqMessageDto {
  @ApiProperty({ example: 'Сколько будет 2+2?', description: 'Текст промпта' })
  readonly message: string;

  @ApiProperty({ example: '5', description: 'id пользователя' })
  readonly userId: number;

  @ApiProperty({ example: 'gpt', description: 'Модель', enum: AiModels })
  readonly model: AiModels;
}
