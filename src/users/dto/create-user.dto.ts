import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test', description: 'Уникальный логин' })
  readonly login: string;

  @ApiProperty({ example: 'test', description: 'Пароль' })
  readonly pwd: string;
}
