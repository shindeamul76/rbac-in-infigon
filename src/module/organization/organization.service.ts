import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationInput } from './type/create-organization.input';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllOrganizations() {
    return this.prisma.organization.findMany({
      include: { users: true, projects: true },
    });
  }

  async findOrganizationById(id: number) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: { users: true, projects: true },
    });
  }

  async findUsersInOrganization(organizationId: number) {
    return this.prisma.user.findMany({
      where: { organizationId },
      include: { roles: true },
    });
  }

  async createOrganization(data: CreateOrganizationInput) {
    return this.prisma.organization.create({
      data,
    });
  }
}