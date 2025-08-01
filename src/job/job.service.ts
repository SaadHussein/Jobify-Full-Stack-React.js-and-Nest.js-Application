import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(createJobDto: CreateJobDto, userId: string): Promise<Job> {
    try {
      return await this.jobModel.create({ ...createJobDto, createdBy: userId });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create job');
    }
  }

  async findAll(userId: string): Promise<Job[]> {
    try {
      return await this.jobModel.find({ createdBy: userId });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve jobs');
    }
  }

  async findOne(id: string): Promise<Job> {
    try {
      const job = await this.jobModel.findById(id);
      if (!job) {
        throw new NotFoundException(`No job found with id: ${id}`);
      }
      return job;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to retrieve job');
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    try {
      const job = await this.jobModel.findByIdAndUpdate(id, updateJobDto, {
        new: true,
        runValidators: true,
      });

      if (!job) {
        console.log('Hiiiii Saaad');
        throw new NotFoundException(`No job found with id: ${id}`);
      }

      return job;
    } catch (error) {
      console.error('Error updating job:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update job');
    }
  }

  async remove(id: string) {
    try {
      const job = await this.jobModel.findByIdAndDelete(id);
      if (!job) {
        throw new NotFoundException(`No job found with id: ${id}`);
      }
      return { message: 'Job deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete job');
    }
  }
}
