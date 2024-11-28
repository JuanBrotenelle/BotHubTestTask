import { AiModels } from '../enum/models.enum';

export class ReqMessageDto {
  readonly message: string;
  readonly userId: number;
  readonly model: AiModels;
}
