import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Tech Solutions Inc.', description: 'The name of the organization' })
  @IsString()
  name: string;
}
