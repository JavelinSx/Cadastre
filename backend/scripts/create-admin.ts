// scripts/create-admin.ts
import { NestFactory } from '@nestjs/core';
import { AdminsService } from 'admins/admins.service';
import { AppModule } from 'app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminsService = app.get(AdminsService);

  try {
    await adminsService.create({
      name: 'admin',
      password: 'admin1234567890',
    });
    console.log('Admin created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  }

  await app.close();
}
bootstrap();
