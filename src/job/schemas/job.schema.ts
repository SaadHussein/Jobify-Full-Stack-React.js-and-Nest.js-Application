import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  position: string;

  @Prop({
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending',
  })
  jobStatus: string;

  @Prop({
    type: String,
    enum: ['full-time', 'part-time', 'internship'],
    default: 'full-time',
  })
  jobType: string;

  @Prop({ default: 'my city' })
  jobLocation: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
