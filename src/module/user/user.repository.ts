import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { email: string; password: string; roles: any[], organizationId: number | null }) {
    const { email, password, roles, organizationId } = data;

    return this.prisma.user.create({
      data: {
        email,
        password,
        organizationId: organizationId,
        roles: {
          create: roles.map((role) => ({
            roleId: role.id,
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        roles: {
          select: {
            userId: true,
            roleId: true
          }
        },
      },
    });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { roles, ...updateData } = updateUserDto;

    if (roles) {

      const roleEntities = await this.prisma.role.findMany({
        where: { name: { in: roles } },
      });

      if (roleEntities.length !== roles.length) {
        throw new Error('One or more roles are invalid');
      }


      return this.prisma.user.update({
        where: { id },
        data: {
          ...updateData,
          roles: {
            deleteMany: {},
            create: roleEntities.map((role) => ({
              roleId: role.id,
            })),
          },
        },
      });
    }


    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findOneUser(email: string) {
    return this.prisma.user.findUnique({
        where:{
            email: email
        }
    })
  }

  async findUserWithPassword(email: string): Promise<any | null> {
    return await this.prisma.user.findUnique({
    where: { email: email },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findFirst({
        where: {
            id: id
        }
    })
  }
}