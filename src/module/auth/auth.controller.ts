import {
    Controller,
    Post,
    Body,
    Req,
    BadRequestException,
    ForbiddenException,
    UseInterceptors,
  } from '@nestjs/common';
  import * as bcrypt from 'bcryptjs';
  import { AuthService } from './auth.service';
  import { UserService } from '../user/user.service';
  import { RegisterUserDto } from './dto/registerUser.dto';
  import { LoginUserDto } from './dto/loginUser.dto';
  import { CookieInterceptor } from './interceptor/cookie.interceptor';
  import { LoginResponse } from './type/loginResponse';
  import { RolesService } from '../roles/roles.service';
import { UserRole } from '@prisma/client';

  
  @UseInterceptors(CookieInterceptor)
  @Controller('/api/auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly userService: UserService,
      private readonly rolesService: RolesService,
    ) {}
  
    @Post('register')
    async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<LoginResponse> {
      const { email, password, roles: inputRoles } = registerUserDto;
  
      // Check if the user already exists
      const existingUser = await this.userService.findOneByEmail(email);
      if (existingUser) {
        throw new BadRequestException('User already exists.');
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Fetch role entities from RolesService
      const roles = await this.rolesService.findRolesByName(inputRoles);
      if (roles.length !== inputRoles.length) {
        throw new BadRequestException('Invalid roles provided.');
      }

  
  
      // Create user with roles
      const user = await this.userService.create({
        email,
        password: hashedPassword,
        roles,
      });
  
      const { id, tokenVersion } = user;
  
      // Generate tokens
      const tokens = this.authService.assignTokens(id, { createdAt: new Date(), updatedAt: new Date(), roleId: 1, userId: 1 }, tokenVersion);
  
      return tokens;
    }
  
    @Post('login')
    async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
      const { email, password } = loginUserDto;
  
      const user = await this.userService.findUserWithPassword(email);
      if (!user) {
        throw new ForbiddenException('Invalid email or password.');
      }
  
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ForbiddenException('Invalid email or password.');
      }
  
      const { id, tokenVersion } = user;
  
  
      const tokens = this.authService.assignTokens(id, { createdAt: new Date(), updatedAt: new Date(), roleId: 1, userId: 1 }, tokenVersion);
  
      return tokens;
    }
  
    @Post('refresh-token')
    async getTokens(@Req() req): Promise<LoginResponse> {
      const token = req.cookies['refreshToken'];
  
      if (!token) {
        throw new ForbiddenException('Refresh token not found.');
      }
  
      try {
        const { accessToken, refreshToken } = await this.authService.refreshTokens(token);
        return { accessToken, refreshToken };
      } catch (error) {
        throw new ForbiddenException(error.message);
      }
    }
  }