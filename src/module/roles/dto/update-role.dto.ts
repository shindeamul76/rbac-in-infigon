import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ example: 'Moderator', description: 'The updated name of the role', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
