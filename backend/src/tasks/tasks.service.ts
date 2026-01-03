import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Application, ApplicationDocument } from 'src/applications/application.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class TasksService {
    constructor(
        @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
        @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>
    ) {}

    async create(createTaskDto: CreateTaskDto, userId: string): Promise<any> {
        const newTask = new this.taskModel({ ...createTaskDto, createdBy: userId });
        const savedTask = await newTask.save();
        const taskObj = savedTask.toObject();

        return {
            id: (taskObj._id as Types.ObjectId).toString(),
            title: taskObj.title,
            description: taskObj.description,
            createdBy: taskObj.createdBy,
            createdAt: taskObj.createdAt
        };
    }

    async findAll(): Promise<any> {
        const tasks = await this.taskModel.find().populate('createdBy', 'name email').lean()
        return tasks.map(task => {

            const createdBy = task.createdBy as unknown as User & { _id: Types.ObjectId};
            return {
                id: (task._id as Types.ObjectId).toString(),
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                createdBy: createdBy
                    ? { id: createdBy._id.toString(), name: createdBy.name, email: createdBy.email }
                    : { id: null, name: 'Contributor', email: '' },
            };
        });
    }

    async findByUser(userId: string): Promise<any> {
        const tasks = await this.taskModel.find({ createdBy: userId }).populate('createdBy', 'name email').lean()
        return tasks.map(task => {

            const createdBy = task.createdBy as unknown as User & { _id: Types.ObjectId};
            return {
                id: (task._id as Types.ObjectId).toString(),
                title: task.title,
                description: task.description,
                createdAt: task.createdAt,
                createdBy: {
                    id: createdBy._id.toString(),
                    name: createdBy.name,
                    email: createdBy.email,
                },
            };
        });
    }

    async getApplicationsForTask(taskId: string, userId: string): Promise<any> {
        const task = await this.taskModel.findById(taskId);
        if (!task) throw new NotFoundException('Task not found');

        if (task.createdBy.toString() !== userId) throw new ForbiddenException('You do not own this task');
        
        const application = await this.applicationModel
        .find({ taskId })
        .populate('userId', 'name email')
        .sort({ appliedAt: -1 })
        .lean();

        return application.map((app) => {

            const user = app.userId as unknown as User & { _id: Types.ObjectId; name: string; email: string; };

            return {
                id: app._id.toString(),
                message: app.message,
                taskId: app.taskId.toString(),
                appliedAt: app.appliedAt,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                },
            };
        });
    }
}