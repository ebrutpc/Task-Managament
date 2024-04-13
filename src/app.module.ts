import { Module } from '@nestjs/common';
import { TasksModule } from './domains/tasks/tasks.module';
import { postgres } from './Infra/databases/postgres.database';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TasksModule, postgres, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
