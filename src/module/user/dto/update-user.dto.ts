import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Updated email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'newpassword123', description: 'Updated password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: ['User'], description: 'Updated roles', type: [String] })
  @IsNotEmpty()
  roles: any[];
}
