import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { Balance } from './balance.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BalanceController],
  providers: [BalanceService],
  imports: [SequelizeModule.forFeature([Balance]), AuthModule, UsersModule],
  exports: [BalanceService],
})
export class BalanceModule {}
