import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AllowedRoles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody,ApiSecurity } from '@nestjs/swagger';

@ApiTags('Projects') // Group all endpoints under "Projects" in Swagger UI
@UseGuards(RolesGuard)
@Controller('projects')
@ApiSecurity('access-token') 
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiBearerAuth('access-token') // Requires Bearer token for authentication
  @AllowedRoles('Admin')
  @ApiOperation({ summary: 'Retrieve all projects (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all projects.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll() {
    return this.projectService.findAllProjects();
  }

  @Get('organization')
  @ApiBearerAuth('access-token')
  @AllowedRoles('Manager')
  @ApiOperation({ summary: 'Retrieve projects by organization (Manager only)' })
  @ApiResponse({ status: 200, description: 'Projects for the manager\'s organization.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not part of an organization.' })
  async findByOrganization(@Request() req: any) {
    const user = req.user;

    if (!user.organizationId) {
      throw new ForbiddenException('You are not part of an organization.');
    }

    return this.projectService.findProjectsByOrganization(user.organizationId);
  }

  @Get('user')
  @ApiBearerAuth('access-token')
  @AllowedRoles('User')
  @ApiOperation({ summary: 'Retrieve projects assigned to the current user' })
  @ApiResponse({ status: 200, description: 'Projects assigned to the user.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findByUser(@Request() req: any) {
    return this.projectService.findProjectsByUser(req.user.id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @AllowedRoles('Manager')
  @ApiOperation({ summary: 'Create a new project (Manager only)' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not part of an organization.' })
  @ApiBody({ type: CreateProjectDto })
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
