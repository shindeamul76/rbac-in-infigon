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
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CookieInterceptor } from './interceptor/cookie.interceptor';
import { LoginResponse } from './type/loginResponse';
import { RolesService } from '../roles/roles.service';
import { ApiTags, ApiBody, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Auth') // Groups these endpoints under "Auth" in Swagger UI
@UseInterceptors(CookieInterceptor)
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly rolesService: RolesService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register A New User' })
  @ApiResponse({ status: 201, description: 'User registered successfully and tokens returned.' })
  @ApiResponse({ status: 400, description: 'User already exists or invalid roles provided.' })
  @ApiBody({ type: RegisterUserDto })
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const { email, password, roles: inputRoles, organizationId } = registerUserDto;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const roles = await this.rolesService.findRolesByName(inputRoles);
    if (roles.length !== inputRoles.length) {
      throw new BadRequestException('Invalid roles provided.');
    }

    const user = await this.userService.create({
      email,
      password: hashedPassword,
      organizationId,
      roles,
    });

    const { id, tokenVersion } = user;
    const tokens = this.authService.assignTokens(id, user.roles, tokenVersion);

    return tokens;
  }

  @Post('login')
  @ApiOperation({ summary: 'Loggin Existing User' })
  @ApiResponse({ status: 200, description: 'User logged in successfully and tokens returned.' })
  @ApiResponse({ status: 403, description: 'Invalid email or password.' })
  @ApiBody({ type: LoginUserDto })
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginUserDto;

    const user = await this.userService.findUserWithPassword(email);
    if (!user) {
      throw new ForbiddenException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid email or password.');
    }

    const { id, tokenVersion } = user;
    const tokens = this.authService.assignTokens(id, user.roles, tokenVersion);

    return tokens;
  }

  @ApiCookieAuth('refreshToken')
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Token For Valid AccessToken' })
  @ApiResponse({ status: 200, description: 'New access and refresh tokens returned.' })
  @ApiResponse({ status: 403, description: 'Refresh token not found or invalid.' })
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
