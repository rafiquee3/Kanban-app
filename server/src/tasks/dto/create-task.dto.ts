import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy milk' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Go to the store and buy 2L of milk', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TODO, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: Priority, default: Priority.MEDIUM, required: false })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}