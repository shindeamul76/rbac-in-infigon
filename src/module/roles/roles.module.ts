import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService],
  exports: [RolesService], // Export the service for use in other modules
})
export class RolesModule {}