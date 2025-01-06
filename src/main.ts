import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.enableCors({
    origin: ['http://localhost:5173'], // Allow specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow credentials
    allowedHeaders: 'Content-Type,Authorization,Accept',
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
  });

  await app.listen(3000);
}
bootstrap();
