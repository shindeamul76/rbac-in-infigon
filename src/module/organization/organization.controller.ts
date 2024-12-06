import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AllowedRoles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard';

@Controller('organizations')
@UseGuards(RolesGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}


  @Get()
  @AllowedRoles('Admin')
  async findAll() {
    return this.organizationService.findAllOrganizations();
  }


  @Get(':id')
  @AllowedRoles('Admin')
  async findOne(@Param('id') id: number) {
    return this.organizationService.findOrganizationById(+id);
  }


  @Post()
  @AllowedRoles('Admin')
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
  }


  @Get(':id/users')
  @AllowedRoles('Manager')
  async getUsersInOrganization(@Request() req: any, @Param('id') id: number) {
    const user = req.user;

    if (user.organizationId !== +id) {
      throw new ForbiddenException('You can only access users in your organization.');
    }

    return this.organizationService.findUsersInOrganization(+id);
  }
}