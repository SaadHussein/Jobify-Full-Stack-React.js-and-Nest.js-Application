import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class JobService {
  private jobs = [
    { id: nanoid(), company: 'apple', position: 'front-end' },
    { id: nanoid(), company: 'google', position: 'back-end' },
  ];

  create(createJobDto: CreateJobDto) {
    const newJob = {
      id: nanoid(),
      ...createJobDto,
    };
    this.jobs.push(newJob);
    return newJob;
  }

  findAll() {
    return this.jobs;
  }

  findOne(id: string) {
    const job = this.jobs.find((job) => job.id === id);
    if (!job) {
      throw new NotFoundException(`Job with ID '${id}' not found`);
    }
    return job;
  }

  update(id: string, updateJobDto: UpdateJobDto) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index === -1) return null;
    this.jobs[index] = { ...this.jobs[index], ...updateJobDto };
    return this.jobs[index];
  }

  remove(id: string) {
    const index = this.jobs.findIndex((job) => job.id === id);
    if (index === -1) return null;
    const job = this.jobs[index];
    this.jobs.splice(index, 1);
    return job;
  }
}
