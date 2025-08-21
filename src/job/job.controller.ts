import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FindAllJobsResponse, JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './schemas/job.schema';
import { ObjectIdValidationPipe } from 'src/common/pipes/objectid.pipe';
import { Request } from 'express';
import { JobOwnershipGuard } from 'src/common/guards/job-ownership.guard';
import { TestUserGuard } from 'src/common/guards/test-user.guard';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(TestUserGuard)
  async create(
    @Req() req: Request,
    @Body() createJobDto: CreateJobDto,
  ): Promise<Job> {
    const user = req.user;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    return await this.jobService.create(createJobDto, user.sub);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('jobStatus') jobStatus?: string,
    @Query('jobType') jobType?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<FindAllJobsResponse> {
    const user = req.user;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.jobService.findAll(user.sub, {
      search,
      jobStatus,
      jobType,
      sort,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('stats')
  async showStats(@Req() req: Request) {
    const user = req.user;

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    return await this.jobService.getStats(user.sub);
  }

  @UseGuards(JobOwnershipGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<Job> {
    return await this.jobService.findOne(id);
  }

  @UseGuards(JobOwnershipGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TestUserGuard)
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<Job> {
    return await this.jobService.update(id, updateJobDto);
  }

  @UseGuards(JobOwnershipGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TestUserGuard)
  async remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return await this.jobService.remove(id);
  }
}
