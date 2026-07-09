import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Register
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Refresh token
  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // Logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user.sub);
  }

  // Get profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
