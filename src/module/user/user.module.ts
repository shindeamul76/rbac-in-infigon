import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService],
  exports: [UserService]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}