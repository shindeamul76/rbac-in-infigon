import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { RolesModule } from './module/roles/roles.module';

@Module({
  imports: [
    AuthModule,  // Import the AuthModule for authentication logic
    UserModule,  // Import the UserModule for user management
    RolesModule, // Import the RolesModule for role management
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
