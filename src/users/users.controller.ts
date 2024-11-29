import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Массив пользователей - Доступ у администратора' })
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiResponse({ status: 200, type: [User] })
  @ApiResponse({ status: 400, example: 'Bad request' })
  @ApiHeader({ name: 'Authorization' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Get()
  getAll() {
    this.logger.log('| GET | --- get all users');
    return this.usersService.getAllUsers();
  }
}
