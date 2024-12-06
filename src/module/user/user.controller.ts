import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guard/role.guard';
import { AllowedRoles } from '../auth/decorator/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam ,ApiBearerAuth,ApiSecurity} from '@nestjs/swagger';

@ApiTags('Users') // Group all endpoints under "Users" in Swagger
@ApiSecurity('access-token') 
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @ApiOperation({ summary: 'Create a new user' })
  // @ApiResponse({ status: 201, description: 'User created successfully.' })
  // @ApiResponse({ status: 400, description: 'Bad request.' })
  // @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
@ApiBearerAuth('access-token')
  @AllowedRoles('Admin')
  @ApiOperation({ summary: 'Retrieve all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @AllowedRoles('Admin', 'User')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Access forbidden: cannot access data of other users.' })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve', type: Number })
  async findOne(@Param('id') id: number, @Request() req: any) {
    const userId = req.user.id;
    if (userId !== id) {
      throw new ForbiddenException('You can only access your own data.');
    }
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @AllowedRoles('Admin', 'User')
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 403, description: 'Access forbidden: cannot modify data of other users.' })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id', description: 'ID of the user to update', type: Number })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    if (userId !== id) {
      throw new ForbiddenException('You can only access your own data.');
    }
    return this.userService.update(+id, updateUserDto);
  }
}
