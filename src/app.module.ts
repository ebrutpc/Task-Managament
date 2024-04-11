import { Module } from '@nestjs/common';
import { TasksModule } from './domains/tasks/tasks.module';
import { postgres } from './Infra/databases/postgres.database';

@Module({
  imports: [TasksModule, postgres],
  controllers: [],
  providers: [],
})
export class AppModule {}
