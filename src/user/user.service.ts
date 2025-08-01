import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { Job, JobDocument } from 'src/job/schemas/job.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
  ) {}

  async getCurrentUser(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return { user };
  }

  async getStats() {
    const users = await this.userModel.countDocuments();
    const jobs = await this.jobModel.countDocuments();
    return { users, jobs };
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { email } = updateUserDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser && String(existingUser._id) !== userId) {
      throw new BadRequestException('Email already exists');
    }

    const updated = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .select('-password');

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }
}
