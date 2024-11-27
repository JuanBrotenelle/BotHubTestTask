import { Controller, Get, Param, Body, Post, UseGuards, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BalanceService } from './balance.service';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { AuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Баланс')
@Controller('balance')
export class BalanceController {
  private readonly logger = new Logger(BalanceController.name);
  constructor(private balanceService: BalanceService) {}

  @ApiOperation({ summary: 'Получение баланса' })
  @ApiResponse({ status: 200, example: { value: 100 } })
  @UseGuards(AuthGuard)
  @Get(':id')
  getBalance(@Param('id') id: number) {
    this.logger.log('| GET | --- get balance by id');
    return this.balanceService.getBalance(id);
  }

  @ApiOperation({ summary: 'Обновление баланса' })
  @ApiResponse({ status: 200, example: { value: 100 } })
  @UseGuards(AuthGuard)
  @Post(':id')
  updateBalance(@Param('id') id: number, @Body() dto: UpdateBalanceDto) {
    this.logger.log('| POST | --- update balance by id');
    return this.balanceService.updateBalance(id, dto.value);
  }
}
