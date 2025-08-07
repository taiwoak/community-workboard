import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor'
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor);

  app.use(express.static(join(__dirname, '..', 'public')));

app.use(/^\/(?!api|auth|tasks|users|m).*/, (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  });
  const port = process.env.PORT ?? 3000
  await app.listen(port);
}
bootstrap();
