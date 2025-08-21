import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as mongoSanitize from 'express-mongo-sanitize';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { join } from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10, // مثلاً 10 requests بس لكل IP في الـ window
  message: 'Too many login/signup attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(helmet());
  app.use(mongoSanitize());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.use('/api/v1/auth', authLimiter);

  const express = app.getHttpAdapter().getInstance();
  // static serving للـ JS, CSS, images
  express.use(
    require('express').static(join(__dirname, '..', 'client', 'dist')),
  );
  // أي route مش /api يرجع index.html
  express.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(join(__dirname, '..', 'client', 'dist', 'index.html'));
  });

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
