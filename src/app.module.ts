import { Module, Logger } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BalanceModule } from './balance/balance.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/users.model';
import { Balance } from './balance/balance.model';
import { LoggerModule } from './logger/logger.module';
import { PinoLoggerService } from './logger/pino-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    SequelizeModule.forRootAsync({
      imports: [LoggerModule],
      inject: [PinoLoggerService],
      useFactory: (logger: PinoLoggerService) => ({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [User, Balance],
        autoLoadModels: true,
        logging: (msg: string) => logger.log(msg),
      }),
    }),
    UsersModule,
    BalanceModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
