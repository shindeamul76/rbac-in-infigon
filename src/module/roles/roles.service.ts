import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;


    const existingRole = await this.prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      throw new BadRequestException('Role already exists.');
    }


    return this.prisma.role.create({
      data: { name },
    });
  }

  async findAllRoles() {
    return this.prisma.role.findMany();
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const { name } = updateRoleDto;


    const existingRole = await this.prisma.role.findUnique({ where: { id } });
    if (!existingRole) {
      throw new BadRequestException('Role not found.');
    }


    return this.prisma.role.update({
      where: { id },
      data: { name },
    });
  }

  async deleteRole(id: number) {

    const existingRole = await this.prisma.role.findUnique({ where: { id } });
    if (!existingRole) {
      throw new BadRequestException('Role not found.');
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async findRolesByName(names: string[]) {
    return this.prisma.role.findMany({
      where: {
        name: {
          in: names,
        },
      },
    });
  }
}