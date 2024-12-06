import { IsEmail, IsNotEmpty, IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;



  @ApiProperty({
    example: ['Admin', 'User'],
    description: 'List of role names to assign to the user',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  roles: string[];

 

  @ApiProperty({ example: 1, description: 'Organization ID', required: false })
  @IsOptional()
  @IsNumber()
  organizationId?: number;
}
