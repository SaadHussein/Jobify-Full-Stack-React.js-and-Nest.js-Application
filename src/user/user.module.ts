import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Job, JobSchema } from 'src/job/schemas/job.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Job.name, schema: JobSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
