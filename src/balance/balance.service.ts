import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Balance } from './balance.model';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance) private balanceRepository: typeof Balance,
  ) {}

  async getBalance(userId: number): Promise<Balance> {
    return this.balanceRepository.findOne({
      where: { userId },
      attributes: ['value'],
    });
  }

  async updateBalance(userId: number, value: number): Promise<object> {
    try {
      const balance = await this.balanceRepository.findOne({
        where: { userId },
      });

      if (!balance) {
        throw new HttpException('Balance not found', 404);
      }

      balance.value = value;
      balance.save();

      return { value: balance.value };
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async aiTokenBuy(streamId: string, value: number): Promise<void> {
    try {
      const userId = streamId.split('-')[0];

      const balance = await this.balanceRepository.findOne({
        where: { userId },
      });

      if (!balance) {
        throw new HttpException('Balance not found', 404);
      }

      if (balance.value <= 0) {
        throw new HttpException('Not enough money', 400);
      }

      balance.value -= value;
      balance.save();
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
