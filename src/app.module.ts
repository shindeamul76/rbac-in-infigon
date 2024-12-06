import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { RolesModule } from './module/roles/roles.module';
import { ProjectModule } from './module/project/project.module';
import { OrganizationModule } from './module/organization/organization.module';



@Module({
  imports: [
    AuthModule,
    UserModule, 
    RolesModule,
    ProjectModule, 
    OrganizationModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
