import { ApiProperty } from '@nestjs/swagger';
import { Column, Table, Model, DataType, HasOne } from 'sequelize-typescript';
import { Balance } from '../balance/balance.model';

interface UserCreationAttrs {
  login: string;
  pwd: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный id, инкременируемый' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'test', description: 'Уникальный логин' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  login: string;

  @ApiProperty({ example: 'test', description: 'Пароль зашифрованный bcrypt' })
  @Column({ type: DataType.STRING, allowNull: false })
  pwd: string;

  @ApiProperty({ example: 'user', description: 'Роль пользователя user/admin' })
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'user' })
  role: string;

  @ApiProperty({ example: '100', description: 'Баланс' })
  @HasOne(() => Balance)
  balance: Balance;
}
