import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JobService } from 'src/job/job.service';
import { Types } from 'mongoose';

@Injectable()
export class JobOwnershipGuard implements CanActivate {
  constructor(
    private readonly jobService: JobService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;
    const jobId = req.params.id;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (!Types.ObjectId.isValid(jobId)) {
      throw new ForbiddenException('Invalid Job ID');
    }

    const job = await this.jobService.findOne(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    console.log('Fine');

    if (user.role === 'admin') return true;

    if (job.createdBy?.toString() === user?.sub.toString()) return true;

    throw new ForbiddenException('Access denied');
  }
}
