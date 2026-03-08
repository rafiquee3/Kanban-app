import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Other modules that this module depends on (e.g., AuthModule needs PrismaModule).
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally across all modules without re-importing ConfigModule
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [AppController], // Controller classes that should be instantiated.
  providers: [AppService], // Providers that will be instantiated by the Nest injector and that may be shared at least across this module.
})
export class AppModule {}
