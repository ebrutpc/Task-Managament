import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskRepository {
  constructor(@InjectRepository(Task) private repository: Repository<Task>) {}
  async getTaskById(id: string): Promise<Task> {
    return this.repository.findOne({ where: { id } });
  }
  async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.repository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.repository.save(task);
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.repository.find();
  }

  async updateTaskById(task: Task): Promise<Task> {
    // await this.repository.update(id, { status });
    await this.repository.save(task);
    return task;
  }

  async deleteTaskById(id: string) {
    return this.repository.delete(id);
  }
}
