import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Application, ApplicationDocument } from './application.schema';
import { Model, Types } from 'mongoose';
import { Task } from 'src/tasks/task.schema';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
        @InjectModel(Task.name) private taskModel: Model<Task>
    ) {}

    async applyToTask(taskId: string, userId: string, createApplicationDto: CreateApplicationDto): Promise<any> {
        const task = await this.taskModel.findById(taskId);
        if (!task) throw new NotFoundException('Task not found');

        const applicationExists = await this.applicationModel.findOne({ taskId, userId });
        if (applicationExists) throw new ConflictException('You already applied to this task');

        const application = await this.applicationModel.create({
            ...createApplicationDto,
            taskId,
            userId,
            appliedAt: new Date(),
        });

        const obj = application.toObject();
        return {
            id: (obj._id as Types.ObjectId).toString(),
            message: obj.message,
            taskId: obj.taskId,
            userId: obj.userId,
            appliedAt: obj.appliedAt,
        };
    }
}
