import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/common/enums/role.enum';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('tasks')
export class ApplicationsController {
    constructor(private applicationService: ApplicationsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Volunteer)
    @Post('/:id/apply')
    applyToTask(@Param('id') taskId: string, @Request() req, @Body() createApplicationDto: CreateApplicationDto) {
        const userId =  req.user.userId;
        return this.applicationService.applyToTask(taskId, userId, createApplicationDto);
    }
}
