import { ApiProperty } from '@nestjs/swagger';

export class UpdateBalanceDto {
  @ApiProperty({ example: 100, description: 'Новое количество монет' })
  readonly value: number;
}
