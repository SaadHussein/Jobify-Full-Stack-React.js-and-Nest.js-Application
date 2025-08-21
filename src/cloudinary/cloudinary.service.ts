import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUD_API_KEY'),
      api_secret: this.configService.get<string>('CLOUD_API_SECRET'),
    });
  }

  async uploadImage(filePath: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        { folder: 'avatars' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Upload failed: result is undefined'));
          }
          resolve(result);
        },
      );
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result?.result !== 'ok') {
          return reject(new Error('Failed to delete image from Cloudinary'));
        }
        resolve();
      });
    });
  }
}
