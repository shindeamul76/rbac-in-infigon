import { Injectable, ForbiddenException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshTokenPayload } from './type/jwtPayload';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async validateRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    try {
      const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
      return decoded;
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token.');
    }
  }

  async findUserForRefresh(userId: number, tokenVersion: number) {
    return this.prisma.user.findFirst({
      where: { id: userId, tokenVersion },
      include: { roles: true },
    });
  }
}