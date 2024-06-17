import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import {CreateTaskDto} from "./dto/create-task.dto";

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    const taskId = await this.taskService.createTask(createTaskDto.description, createTaskDto.duration);
    return { taskId };
  }

  @Get(':id')
  async getTaskStatus(@Param('id') id: number) {
    const status = await this.taskService.getTaskStatus(id);
    return { status };
  }

  @Post(':id/status')
  async updateTaskStatus(@Param('id') id: number, @Body('status') status: string) {
    if (typeof status !== 'string') {
      throw new Error('Status must be a string');
    }
    await this.taskService.updateTaskStatus(id, status);
  }

  @Get()
  async getAllTasks() {
    const tasks = await this.taskService.getAllTasks();
    return { tasks };
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number) {
    await this.taskService.deleteTask(id);
    return { message: `Task ${id} deleted successfully` };
  }

  @Put(':id')
  async updateTask(@Param('id') id: number, @Body() updateTaskDto: CreateTaskDto) {
    await this.taskService.updateTask(id, updateTaskDto.description, updateTaskDto.duration);
    return { message: `Task ${id} updated successfully` };
  }

  @Post(':id/assign')
  async assignTask(@Param('id') id: number, @Body('assignedTo') assignedTo: string) {
    await this.taskService.assignTask(id, assignedTo);
    return { message: `Task ${id} assigned to user ${assignedTo}` };
  }

  @Get(':id/executor')
  async findExecutor(@Param('id') id: number) {
    const executor = await this.taskService.findExecutor(id);
    return { executor };
  }
}
