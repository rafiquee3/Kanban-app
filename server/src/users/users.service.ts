import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private userSelect = {
    id: true,
    email: true,
    createdAt: true,
    // password: false <-- we don't fetch the password by default
  };

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect, // We're not returning the password to the controller
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(email: string, pass: string) {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(pass, 12);

    return this.prisma.user.create({
      data: { email, password: hash },
      select: this.userSelect, // Returning the created user without the password
    });
  }

  async getUserWithTasks(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        tasks: true, // Prisma will automatically include the array of tasks
      },
    });
  }
}
