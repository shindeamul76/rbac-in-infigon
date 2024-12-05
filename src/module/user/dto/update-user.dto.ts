import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  roles: any[];
}