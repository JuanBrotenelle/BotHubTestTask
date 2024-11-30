import { Controller, Get, UseGuards, Logger, Post, Body } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './users.model';
import { AuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Массив пользователей - Доступ у администратора' })
  @ApiResponse({ status: 200, type: [User] })
  @ApiResponse({ status: 400, example: 'Bad request' })
  @ApiResponse({ status: 403, example: 'Forbidden resource' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Get()
  getAll() {
    this.logger.log('| GET | --- get all users');
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Сделать пользователя администратором' })
  @ApiResponse({ status: 200, example: 200 })
  @ApiResponse({ status: 400, example: 'Bad request' })
  @Post()
  makeAdmin(@Body() dto: CreateUserDto) {
    this.logger.log('| POST | --- make admin');
    return this.usersService.makeAdmin(dto);
  }
}
