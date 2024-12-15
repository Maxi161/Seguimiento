import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/config/env.config';
import { UserService } from 'src/modules/users/users.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const token = req.headers['authorization']?.split(' ')[1] ?? '';
      if (!token) {
        throw new HttpException({ status: 401, error: 'Unauthorized' }, 401);
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });

      if (!payload) {
        throw new HttpException(
          { status: 401, error: 'Unauthorized token' },
          401,
        );
      }

      const userFound = await this.userService.getById(payload.id);

      if (!userFound) {
        throw new HttpException({ status: 404, error: 'User not found' }, 404);
      }

      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      payload.role = [userFound.role];
      req.body.user = payload;

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
