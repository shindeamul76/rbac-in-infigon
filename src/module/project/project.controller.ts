import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AllowedRoles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard';

@Controller('projects')
@UseGuards(RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}


  @Get()
  @AllowedRoles('Admin')
  async findAll() {
    return this.projectService.findAllProjects();
  }


  @Get('organization')
  @AllowedRoles('Manager')
  async findByOrganization(@Request() req: any) {
    const user = req.user;

    if (!user.organizationId) {
      throw new ForbiddenException('You are not part of an organization.');
    }

    return this.projectService.findProjectsByOrganization(user.organizationId);
  }


  @Get('user')
  @AllowedRoles('User')
  async findByUser(@Request() req: any) {
    return this.projectService.findProjectsByUser(req.user.id);
  }


  @Post()
  @AllowedRoles('Manager')
  async create(@Request() req: any, @Body() createProjectDto: CreateProjectDto) {
    const user = req.user;

    if (!user.organizationId) {
      throw new ForbiddenException('You are not part of an organization.');
    }

    return this.projectService.createProject({
      ...createProjectDto,
      organizationId: user.organizationId,
    });
  }
}