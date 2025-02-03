import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // Добавляем глобальную валидацию
  app.useGlobalPipes(new ValidationPipe());

  // Включаем CORS если нужно
  app.enableCors({
    origin: 'http://localhost:3000', // URL фронтенда
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
