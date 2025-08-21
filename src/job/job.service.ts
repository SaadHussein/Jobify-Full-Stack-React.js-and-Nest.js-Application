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
import { FilterQuery, Model } from 'mongoose';
import * as dayjs from 'dayjs';

export interface FindAllJobsResponse {
  totalJobs: number;
  numOfPages: number;
  currentPage: number;
  jobs: Job[];
}

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

  async findAll(
    userId: string,
    query: {
      search?: string;
      jobStatus?: string;
      jobType?: string;
      sort?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<FindAllJobsResponse> {
    try {
      const { search, jobStatus, jobType, sort } = query;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      console.log(page, limit);

      const queryObject: FilterQuery<Job> = {
        createdBy: userId,
      };

      if (search) {
        queryObject.$or = [
          { position: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
        ];
      }

      if (jobStatus && jobStatus !== 'all') {
        queryObject.jobStatus = jobStatus;
      }

      if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType;
      }

      const sortOptions: Record<string, string> = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'position',
        'z-a': '-position',
      };

      const sortKey =
        sortOptions[sort as keyof typeof sortOptions] ?? sortOptions.newest;

      const skip = (page - 1) * limit;

      const jobs = await this.jobModel
        .find(queryObject)
        .sort(sortKey)
        .skip(skip)
        .limit(limit);

      console.log(skip, limit, page);

      const totalJobs = await this.jobModel.countDocuments(queryObject);
      const numOfPages = Math.ceil(totalJobs / limit);

      console.log({
        totalJobs,
        numOfPages,
        currentPage: page,
      });

      return {
        totalJobs,
        numOfPages,
        currentPage: page,
        jobs,
      };
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

  async getStats(userId: string) {
    console.log(userId);
    let stats = await this.jobModel.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
    ]);

    console.log(stats);
    stats = stats.reduce(
      (acc: Record<string, number>, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log(stats);

    const defaultStats = {
      pending: stats['pending'] || 0,
      interview: stats['interview'] || 0,
      declined: stats['declined'] || 0,
    };

    let monthlyApplications = await this.jobModel.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;

        const date = dayjs()
          .month(month - 1)
          .year(year)
          .format('MMM YY');

        return { date, count };
      })
      .reverse();

    console.log(monthlyApplications);
    return { defaultStats, monthlyApplications };
  }
}
