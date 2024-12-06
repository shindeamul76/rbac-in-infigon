import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'The name of the role to create' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
