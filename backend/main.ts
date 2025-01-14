import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Добавляем глобальную валидацию
  app.useGlobalPipes(new ValidationPipe());

  // Включаем CORS если нужно
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
