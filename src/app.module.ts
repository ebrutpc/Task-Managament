import { Module } from '@nestjs/common';
import { TasksModule } from './domains/tasks/tasks.module';
import { postgres } from './Infra/databases/postgres.database';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.stage.${process.env.STAGE}`,
      validationSchema: configValidationSchema,
    }),
    TasksModule,
    postgres,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
