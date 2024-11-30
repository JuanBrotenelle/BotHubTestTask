import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

interface UserRep {
  role: string;
  id: number;
  login: string;
  pwd: string;
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      const user = this.jwtService.decode(token);

      const userRep: UserRep = await this.usersRepository.findOne(user);

      if (userRep.role !== 'admin') return false;

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
