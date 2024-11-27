import { ApiProperty } from '@nestjs/swagger';
import { Column, Table, Model, DataType } from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { ForeignKey } from 'sequelize-typescript';

interface BalanceCreationAttrs {
  value: number;
  userId: number;
}

@Table({ tableName: 'balance' })
export class Balance extends Model<Balance, BalanceCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный id, инкременируемый' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '100', description: 'Баланс' })
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 100 })
  value: number;

  @ApiProperty({ example: '1', description: 'ID пользователя' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;
}
