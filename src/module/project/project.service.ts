import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectInput } from './type/create-project-input';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllProjects() {
    return this.prisma.project.findMany({
      include: { organization: true, users: true },
    });
  }

  async findProjectsByOrganization(organizationId: number) {
    return this.prisma.project.findMany({
      where: { organizationId },
      include: { users: true },
    });
  }

  async findProjectsByUser(userId: number) {
    return this.prisma.project.findMany({
      where: {
        users: {
          some: { id: userId },
        },
      },
      include: { organization: true },
    });
  }

  async createProject(data: CreateProjectInput) {
    return this.prisma.project.create({
      data: {
        name: data.name,
        organizationId: data.organizationId,
      },
    });
  }
}