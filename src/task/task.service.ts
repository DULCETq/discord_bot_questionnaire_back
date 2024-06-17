import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Task} from "./entities/task.entity";

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(description: string, duration: number): Promise<number> {
    const task = this.taskRepository.create({ description, duration, status: 'pending' });
    const savedTask = await this.taskRepository.save(task);
    return savedTask.id;
  }

  async getTaskStatus(taskId: number): Promise<string> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    return task?.status ?? 'Task not found';
  }

  async updateTaskStatus(taskId: number, status: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }
    task.status = status;
    await this.taskRepository.save(task);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async deleteTask(taskId: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }
    await this.taskRepository.remove(task);
  }

  async updateTask(taskId: number, description: string, duration: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }
    task.description = description;
    task.duration = duration;
    await this.taskRepository.save(task);
  }

  async assignTask(taskId: number, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }
    task.assignedTo = userId;
    await this.taskRepository.save(task);
  }

  async findExecutor(taskId: number): Promise<string> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error('Task not found');
    }
    return task.assignedTo ?? 'No executor assigned';
  }
}
