import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(userDto: CreateUserDto): Promise<string> {
    try {
      const user = await this.usersService.findOne(userDto);

      const passwordEquals = await bcrypt.compare(userDto.pwd, user.pwd);

      if (!passwordEquals) {
        throw new UnauthorizedException();
      }

      const payload = { login: user.login, id: user.id, role: user.role };

      return this.jwtService.sign(payload);
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException('User not found', 404);
    }
  }

  async register(userDto: CreateUserDto): Promise<HttpStatus> {
    try {
      const user = await this.usersService.findOne(userDto);

      if (user) {
        throw new HttpException('User already exists', 400);
      }

      const hashPassword = await bcrypt.hash(userDto.pwd, 5);
      const createdUser = await this.usersService.createUser({
        login: userDto.login,
        pwd: hashPassword,
      });

      if (!createdUser) {
        throw new HttpException('User not created', 400);
      }

      return HttpStatus.CREATED;
    } catch (e) {
      console.log(e);
      throw new HttpException('User not found', 404);
    }
  }
}
