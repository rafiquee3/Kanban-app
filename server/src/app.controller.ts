import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard) // <--- Guard protects the endpoint
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Returns data extracted from the token!
  }
}
