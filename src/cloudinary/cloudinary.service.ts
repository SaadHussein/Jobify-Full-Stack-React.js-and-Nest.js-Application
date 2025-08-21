import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Express } from 'express';
import { extname } from 'path';
import DatauriParser = require('datauri/parser');

@Injectable()
export class CloudinaryService {
  private parser = new DatauriParser();

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUD_API_KEY'),
      api_secret: this.configService.get<string>('CLOUD_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    const fileExt = extname(file.originalname).toString();
    const file64 = this.parser.format(fileExt, file.buffer);

    if (!file64.content) {
      throw new Error('Failed to convert file to base64');
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file64.content!, // هنا بنرفع من الـ buffer مباشرة
        { folder: 'avatars' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
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
    if (!publicId) {
      throw new Error('Public ID is required to delete image');
    }

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
