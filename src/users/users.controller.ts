import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Массив пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiHeader({ name: 'Authorization' })
  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    this.logger.log('| GET | --- get all users');
    return this.usersService.getAllUsers();
  }
}
