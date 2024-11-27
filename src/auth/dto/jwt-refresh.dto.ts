import { ApiProperty } from '@nestjs/swagger';

export class JwtRefreshDto {
  @ApiProperty({ example: 'Bearer token', description: 'Устаревший токен' })
  readonly refreshToken: string;
}
