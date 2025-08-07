import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { ApplicationsModule } from 'src/applications/applications.module';
import { Application, ApplicationSchema } from 'src/applications/application.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Task.name, schema: TaskSchema},
    { name: Application.name, schema: ApplicationSchema}
  ]), 
  forwardRef(() => ApplicationsModule),
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
