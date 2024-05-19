import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDTO } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository {
  private _logger = new Logger('TaskRepository', { timestamp: true });
  constructor(@InjectRepository(Task) private repository: Repository<Task>) {}
  async getTaskById(id: string, user: User): Promise<Task> {
    return this.repository.findOne({ where: { id, user } });
  }
  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.repository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.repository.save(task);
    return task;
  }

  async getAllTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { search, status } = filterDto;
    const query = this.repository.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async updateTaskById(task: Task): Promise<Task> {
    await this.repository.save(task);
    return task;
  }

  async deleteTaskById(id: string, user: User) {
    return this.repository.delete({ id, user });
  }
}
