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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AllowedRoles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody ,ApiSecurity} from '@nestjs/swagger';

@ApiTags('Organizations') // Group all endpoints under "Organizations" in Swagger UI
@UseGuards(RolesGuard)
@Controller('organizations')
@ApiSecurity('access-token') 

export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @ApiBearerAuth('access-token') // Requires Bearer token for authentication
  @AllowedRoles('Admin')
  @ApiOperation({ summary: 'Retrieve all organizations (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all organizations.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll() {
    return this.organizationService.findAllOrganizations();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @AllowedRoles('Admin')
  @ApiOperation({ summary: 'Retrieve a specific organization by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Organization details.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  @ApiParam({ name: 'id', description: 'ID of the organization to retrieve', type: Number })
  async findOne(@Param('id') id: number) {
    return this.organizationService.findOrganizationById(+id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @AllowedRoles('Admin')
  @ApiOperation({ summary: 'Create a new organization (Admin only)' })
  @ApiResponse({ status: 201, description: 'Organization created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateOrganizationDto })
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(createOrganizationDto);
  }

  @Get(':id/users')
  @ApiBearerAuth('access-token')
  @AllowedRoles('Manager')
  @ApiOperation({ summary: 'Retrieve users in a specific organization (Manager only)' })
  @ApiResponse({ status: 200, description: 'List of users in the organization.' })
  @ApiResponse({ status: 403, description: 'Forbidden: You can only access users in your organization.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  @ApiParam({ name: 'id', description: 'ID of the organization', type: Number })
  async getUsersInOrganization(@Request() req: any, @Param('id') id: number) {
    const user = req.user;

    if (user.organizationId !== +id) {
      throw new ForbiddenException('You can only access users in your organization.');
    }

    return this.organizationService.findUsersInOrganization(+id);
  }
}
