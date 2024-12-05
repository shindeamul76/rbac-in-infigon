import { Injectable, ForbiddenException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { AccessTokenPayload, RefreshTokenPayload } from './type/jwtPayload';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  createAccessToken(payload: AccessTokenPayload): string {
    return sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  }

  createRefreshToken(payload: RefreshTokenPayload): string {
    return sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  }

  assignTokens(userId: number, role: any, tokenVersion: number) {
    return {
      accessToken: this.createAccessToken({ userId, role }),
      refreshToken: this.createRefreshToken({ userId, tokenVersion }),
    };
  }

  async refreshTokens(refreshToken: string) {
    // Validate refresh token
    const decodedToken = await this.authRepository.validateRefreshToken(refreshToken);

    // Find user by token version and ID
    const user = await this.authRepository.findUserForRefresh(
      decodedToken.userId,
      decodedToken.tokenVersion,
    );

    if (!user) {
      throw new ForbiddenException('Please register or sign in.');
    }


    const { id, roles, tokenVersion } = user;
    return {
      user,
      ...this.assignTokens(id, roles, tokenVersion),
    };
  }
}