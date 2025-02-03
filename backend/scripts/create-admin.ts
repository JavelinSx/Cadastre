// scripts/create-admin.ts
import { NestFactory } from '@nestjs/core';
import { AdminsService } from '../admins/admins.service';
import { AppModule } from '../app.module';
import type { Admin } from '../admins/schemas/admin.schema';

async function bootstrap() {
  console.log('Starting admin creation script...');

  try {
    console.log('Initializing NestJS application...');
    const app = await NestFactory.createApplicationContext(AppModule);
    console.log('NestJS application initialized successfully');

    console.log('Getting AdminsService...');
    const adminsService = app.get(AdminsService);
    console.log('AdminsService retrieved successfully');

    console.log('Creating admin user...');
    const admin = await adminsService.create({
      name: 'admin',
      password: 'admin1234567890',
    });

    console.log('Admin created successfully:');
    console.log({
      name: admin.name,
      // Используем безопасное приведение типов для MongoDB документа
      id: admin['_id']?.toString(),
    });

    await app.close();
    console.log('Application closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error occurred:', error);
    process.exit(1);
  }
}

console.log('MongoDB URI:', process.env.MONGODB_URI);
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
