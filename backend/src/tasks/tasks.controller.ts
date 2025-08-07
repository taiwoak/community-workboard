import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/common/enums/role.enum';

@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Contributor)
    @Post('tasks')
    create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
        return this.tasksService.create(createTaskDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Volunteer)
    @Get('tasks')
    getAllTasks() {
        return this.tasksService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Contributor)
    @Get('my-posted-tasks')
    findByUser(@Request() req) {
        return this.tasksService.findByUser(req.user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Contributor)
    @Get('tasks/:id/applications')
    getApplications(@Param('id') taskId: string, @Request() req) {
        const userId = req.user.userId
        return this.tasksService.getApplicationsForTask(taskId, userId);
    }
}
