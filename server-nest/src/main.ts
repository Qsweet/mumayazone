import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.use((req: any, res: any, next: any) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'https://mqudah.com'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Mqudah Platform API')
    .setDescription('The Mqudah Platform API description')
    .setVersion('1.0')
    .addTag('mqudah')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
