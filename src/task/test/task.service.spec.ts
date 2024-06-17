import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {TaskService} from "../task.service";
import {Task} from "../entities/task.entity";

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  it('должен быть определен', async () => {
    const task = { description: 'Test Task', duration: 30, status: 'pending' };
    const savedTask = { id: 1, ...task };

    jest.spyOn(repository, 'save').mockResolvedValue(savedTask as Task);
    jest.spyOn(repository, 'create').mockReturnValue(task as Task);

    const result = await service.createTask('Test Task', 30);
    expect(result).toEqual(savedTask.id);
  });

  it('должен получить статус', async () => {
    const task = { id: 1, description: 'Test Task', duration: 30, status: 'pending' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);

    expect(await service.getTaskStatus(1)).toEqual('pending');
  });

  it('должен обновить статус', async () => {
    const task = { id: 1, description: 'Test Task', duration: 30, status: 'pending' };
    const updatedTask = { ...task, status: 'completed' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedTask as Task);

    await service.updateTaskStatus(1, 'completed');
    expect(repository.save).toHaveBeenCalledWith(updatedTask);
  });

  it('должно выдать ошибку, если задача не найдена при обновлении статуса', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.updateTaskStatus(1, 'completed')).rejects.toThrow('Task not found');
  });

  it('должны получить все задания', async () => {
    const tasks = [
      { id: 1, description: 'Test Task 1', duration: 30, status: 'pending' },
      { id: 2, description: 'Test Task 2', duration: 60, status: 'completed' },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(tasks as Task[]);

    expect(await service.getAllTasks()).toEqual(tasks);
  });

  it('должен удалить задачу', async () => {
    const task = { id: 1, description: 'Test Task', duration: 30, status: 'pending' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
    jest.spyOn(repository, 'remove').mockResolvedValue(task as Task);

    await service.deleteTask(1);
    expect(repository.remove).toHaveBeenCalledWith(task);
  });

  it('должно выдать ошибку, если задача не найдена при удалении', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.deleteTask(1)).rejects.toThrow('Task not found');
  });

  it('должен обновить задачу', async () => {
    const task = { id: 1, description: 'Test Task', duration: 30, status: 'pending' };
    const updatedTask = { ...task, description: 'Updated Task', duration: 60 };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedTask as Task);

    await service.updateTask(1, 'Updated Task', 60);
    expect(repository.save).toHaveBeenCalledWith(updatedTask);
  });

    it('должно выдать ошибку, если задача не найдена при обновлении', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.updateTask(1, 'Updated Task', 60)).rejects.toThrow('Task not found');
  });

  it('должен назначить задачу пользователю', async () => {
    const task = { id: 1, description: 'Test Task', duration: 30, status: 'pending', assignedTo: null };
    const assignedTask = { ...task, assignedTo: 'user123' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task as unknown as Task);
    jest.spyOn(repository, 'save').mockResolvedValue(assignedTask as unknown as Task);

    await service.assignTask(1, 'user123');
    expect(repository.save).toHaveBeenCalledWith(assignedTask);
  });

  it('должно выдать ошибку, если задача не найдена при назначении', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.assignTask(1, 'user123')).rejects.toThrow('Task not found');
  });

  it('должен найти исполнителя задачи', async () => {
    const task = { id: 1, description: 'Test Task', duration: 30, status: 'pending', assignedTo: 'user123' };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);

    expect(await service.findExecutor(1)).toEqual('user123');
  });

  it('должен вернуть "No executor assigned" если исполнитель не найден', async () => {
    const task = { id: 1, description: 'Test Task', duration: 30, status: 'pending', assignedTo: null };

    jest.spyOn(repository, 'findOne').mockResolvedValue(task as unknown as Task);

    expect(await service.findExecutor(1)).toEqual('No executor assigned');
  });

  it('должен выдавать ошибку, если задача не найдена при поиске исполнителя', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findExecutor(1)).rejects.toThrow('Task not found');
  });
});
