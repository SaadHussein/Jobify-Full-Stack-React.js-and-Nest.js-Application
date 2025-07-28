import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  NotFoundException,
  UseFilters,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';

@Controller('job')
@UseFilters(AllExceptionsFilter)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto) {
    const job = this.jobService.create(createJobDto);
    return {
      message: 'Job created successfully',
      data: job,
    };
  }

  @Get()
  async findAll() {
    const jobs = this.jobService.findAll();

    if (!jobs || jobs.length === 0) {
      throw new NotFoundException('No jobs found');
    }

    return {
      message: 'Jobs retrieved successfully',
      data: jobs,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const job = this.jobService.findOne(id);
    return {
      message: 'Job retrieved successfully',
      data: job,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    const job = this.jobService.update(id, updateJobDto);
    if (!job) throw new NotFoundException(`No job found with id: ${id}`);
    return job;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const job = this.jobService.remove(id);
    if (!job) throw new NotFoundException(`No job found with id: ${id}`);
    return { message: 'Job deleted successfully' };
  }
}
