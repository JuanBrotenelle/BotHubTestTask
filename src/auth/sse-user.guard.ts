import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SseUserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    try {
      const token = req.query.token;

      if (!token) {
        throw new UnauthorizedException();
      }
      const idQuery = req.query.streamId;

      if (!idQuery) {
        throw new HttpException('Stream not found', 404);
      }

      const userId = idQuery.split('-')[0];

      if (!userId) {
        throw new HttpException('Something went wrong', 500);
      }

      const user = this.jwtService.decode(token);
      console.log(user);

      return Number(userId) === Number(user.id);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
