import { IsEmail, IsNotEmpty, IsString, IsArray } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  roles: string[]; 

  @IsNotEmpty()
  @IsString()
  name: string;
}