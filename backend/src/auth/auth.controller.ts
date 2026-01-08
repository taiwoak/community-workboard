import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('auth/register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('auth/login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Request() req) {
        return this.authService.getMe(req.user.userId)
    }

    @Post('auth/google')
    async googleAuth(@Body() dto: GoogleAuthDto) {
        return this.authService.googleAuth(dto);
    }

}
