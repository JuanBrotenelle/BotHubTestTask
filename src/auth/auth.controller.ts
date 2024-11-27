import { Body, Controller, Post, Logger } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Логин' })
  @ApiResponse({ status: 200, example: 'Bearer token' })
  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    this.logger.log('| POST | --- login');
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 201, example: { message: 'User created' } })
  @Post('/register')
  register(@Body() userDto: CreateUserDto) {
    this.logger.log('| POST | --- register');
    return this.authService.register(userDto);
  }
}
