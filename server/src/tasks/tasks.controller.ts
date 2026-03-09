import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiUnauthorizedResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized - Valid JWT token required' })
@Controller('tasks')
@UseGuards(JwtAuthGuard) // Protect the entire controller with JWT
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiCreatedResponse({ description: 'Task created successfully' })
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    // req.user comes from JwtStrategy, which we implemented earlier
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user tasks with optional filters' })
  @ApiOkResponse({ description: 'List of tasks retrieved successfully' })
  findAll(@Req() req, @Query() filterDto: GetTasksFilterDto) {
    return this.tasksService.findAll(req.user.userId, filterDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({ description: 'Task status updated successfully' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Req() req,
  ) {
    return this.tasksService.updateStatus(
      id,
      updateTaskStatusDto.status,
      req.user.userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiOkResponse({ description: 'Task deleted successfully' })
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.tasksService.remove(id, req.user.userId);
  }
}
