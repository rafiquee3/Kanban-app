import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Buy milk', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Go to the store and buy 2L of milk',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ enum: Priority, required: false })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
