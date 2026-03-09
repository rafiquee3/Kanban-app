import { IsOptional, IsEnum } from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GetTasksFilterDto {
  @ApiProperty({ enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: Priority, required: false })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}
