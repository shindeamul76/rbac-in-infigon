import { MiddlewareConsumer, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { RolesModule } from '../roles/roles.module';
import { RolesGuard } from './guard/role.guard';
import { Reflector } from '@nestjs/core';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    forwardRef(() => UserModule),
    RolesModule,
  ],
  providers: [AuthService, AuthRepository, PrismaService, RolesGuard, Reflector],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}