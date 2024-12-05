import { Controller, Get, Post, Body, Param, Patch, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { AllowedRoles } from '../auth/decorator/roles.decorator';

@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @AllowedRoles('Admin') 
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @AllowedRoles('Admin', 'User')
  async findOne(@Param('id') id: number, @Request() req: any) {
    const userId = req.user.id;
    if (userId !== id) {
      throw new ForbiddenException('You can only access your own data.');
    }
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @AllowedRoles('Admin', 'User')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const userId = req.user.id;
    if (userId !== id) {
      throw new ForbiddenException('You can only access your own data.');
    }
    return this.userService.update(+id, updateUserDto);
  }
}