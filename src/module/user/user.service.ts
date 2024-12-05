import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.createUser(createUserDto);
  }

  async findAll() {
    return this.userRepository.findAllUsers();
  }

  async findOne(id: number) {
    return this.userRepository.findUserById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateUser(id, updateUserDto);
  }

  async remove(id: number) {
    return this.userRepository.deleteUser(id);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneUser(email)
  }

  async findUserWithPassword(email: string): Promise<any | null> {
    return await this.userRepository.findUserWithPassword(email)
  }
  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneById(id)
  }
}