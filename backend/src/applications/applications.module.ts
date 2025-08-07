import { forwardRef, Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './application.schema';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { Task, TaskSchema } from 'src/tasks/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema},
      { name: Task.name, schema: TaskSchema },
    ]),
    forwardRef(() => TasksModule),
    UsersModule,
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [MongooseModule]
})
export class ApplicationsModule {}
