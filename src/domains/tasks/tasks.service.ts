import { Injectable, NotFoundException } from '@nestjs/common';
//import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  getAllTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filterDto, user);
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with "${id}" not found.`, {
        description: 'tasks.service.getById',
      });
    }
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.deleteTaskById(id, user);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`, {
        description: 'task.service.deleteTask',
      });
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id, user);
    if (!task) {
      throw new NotFoundException(`Task with "${id}" not found.`, {
        description: 'tasks.service.updateTaskStatus',
      });
    }
    task.status = status;
    return this.taskRepository.updateTaskById(task);
  }
}
