import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findById(id: number) {
    return this.prisma.organization.findUnique({ where: { id } });
  }

  async create(data: { name: string }) {
    return this.prisma.organization.create({ data });
  }

  async findUsersInOrganization(organizationId: number) {
    return this.prisma.user.findMany({ where: { organizationId } });
  }
}