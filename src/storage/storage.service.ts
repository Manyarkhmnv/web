import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('YANDEX_STORAGE_REGION'),
      endpoint: this.configService.get<string>('YANDEX_STORAGE_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('YANDEX_STORAGE_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('YANDEX_STORAGE_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
    this.bucketName = this.configService.get<string>('YANDEX_STORAGE_BUCKET');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;
    
    try {
      console.log('Uploading file to Yandex Object Storage:', {
        bucket: this.bucketName,
        key,
        contentType: file.mimetype,
      });

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      console.log('File uploaded successfully');
      return key;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFileUrl(key: string): Promise<string> {
    try {
      console.log('Getting signed URL for file:', {
        bucket: this.bucketName,
        key,
      });

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      console.log('Generated signed URL:', url);
      return url;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      console.log('Deleting file from Yandex Object Storage:', {
        bucket: this.bucketName,
        key,
      });

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
} 