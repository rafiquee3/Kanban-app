import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import type { RequestWithUser } from './auth/interfaces/request-with-user.interface';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard) // <--- Guard protects the endpoint
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
