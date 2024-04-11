import { Injectable, NotFoundException } from '@nestjs/common';
//import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getAllTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filterDto);
  }

  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with "${id}" not found.`, {
        description: 'tasks.service.getById',
      });
    }
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.deleteTaskById(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID: ${id} not found`, {
        description: 'task.service.deleteTask',
      });
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with "${id}" not found.`, {
        description: 'tasks.service.updateTaskStatus',
      });
    }
    task.status = status;
    return this.taskRepository.updateTaskById(task);
  }
}
