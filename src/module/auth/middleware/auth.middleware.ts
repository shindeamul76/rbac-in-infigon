import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from 'src/module/user/user.service';
import { AccessTokenPayload } from '../type/jwtPayload';

/**
 * Middleware to authenticate and attach user to the request object.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];

    if (!bearerHeader || !accessToken) {
      return next();
    }

    try {

      const { userId, role }: AccessTokenPayload = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
      ) as AccessTokenPayload;


      const user = await this.userService.findOneById(userId);

      if (!user) {
        throw new ForbiddenException('Invalid token. User does not exist.');
      }


      req.user = { ...user, role };
    } catch (error) {
      throw new ForbiddenException('Invalid or expired token.');
    }

    next();
  }
}