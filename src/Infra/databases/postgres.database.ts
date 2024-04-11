import { TypeOrmModule } from '@nestjs/typeorm';

export const postgres = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'task-management',
  autoLoadEntities: true,
  synchronize: true,
});
