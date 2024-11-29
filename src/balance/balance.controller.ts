import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@ApiTags('Баланс')
@Controller('balance')
export class BalanceController {
  private readonly logger = new Logger(BalanceController.name);
  constructor(private balanceService: BalanceService) {}

  @ApiOperation({ summary: 'Получение баланса' })
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiResponse({ status: 200, example: { value: 100 } })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiQuery({ name: 'id', example: 1 })
  @UseGuards(AuthGuard)
  @Get(':id')
  getBalance(@Param('id') id: number) {
    this.logger.log('| GET | --- get balance by id');
    return this.balanceService.getBalance(id);
  }

  @ApiOperation({ summary: 'Изменение баланса - Доступ у администратора' })
  @ApiHeader({ name: 'Authorization', required: true })
  @ApiQuery({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, example: { value: 100 } })
  @ApiResponse({ status: 404, example: 'Balance not found' })
  @ApiResponse({ status: 400, example: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Post(':id')
  updateBalance(@Param('id') id: number, @Body() dto: UpdateBalanceDto) {
    this.logger.log('| POST | --- update balance by id');
    return this.balanceService.updateBalance(id, dto.value);
  }
}
