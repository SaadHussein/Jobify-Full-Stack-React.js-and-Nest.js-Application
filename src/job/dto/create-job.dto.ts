import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { JOB_STATUS, JOB_TYPE } from 'src/utils/constants';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  position: string;

  @IsString()
  @IsNotEmpty({ message: 'Company is required' })
  company: string;

  @IsOptional()
  @IsEnum(JOB_STATUS, {
    message: 'Invalid job status value',
  })
  jobStatus: keyof typeof JOB_STATUS;

  @IsOptional()
  @IsEnum(JOB_TYPE, {
    message: 'Invalid job type value',
  })
  jobType: keyof typeof JOB_TYPE;

  @IsString()
  @IsNotEmpty({ message: 'Job location is required' })
  jobLocation: string;
}
