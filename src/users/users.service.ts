import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { Balance } from 'src/balance/balance.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private usersRepository: typeof User) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { login: dto.login },
      });

      if (existingUser) {
        throw new HttpException('User already exists', 400);
      }

      const user = await this.usersRepository.create(dto);

      await Balance.create({ userId: user.id });

      const userWithBalance = await this.usersRepository.findOne({
        where: { id: user.id },
        include: {
          model: Balance,
          attributes: ['value'],
        },
      });

      return userWithBalance;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.usersRepository.findAll({
        include: {
          model: Balance,
          attributes: ['value'],
        },
      });
      return users;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOne(userDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { login: userDto.login },
        include: {
          model: Balance,
          attributes: ['value'],
        },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async makeAdmin(userDto: CreateUserDto): Promise<HttpStatus> {
    try {
      const user = await this.findOne(userDto);

      if (!user) throw new HttpException('User not found', 404);

      user.role = 'admin';

      user.save();

      return HttpStatus.OK;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
