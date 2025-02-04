// scripts/create-admin.ts
import { NestFactory } from '@nestjs/core';
import { AdminsService } from '../admins/admins.service';
import { AppModule } from '../app.module';
import type { Admin } from '../admins/schemas/admin.schema';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    const adminsService = app.get(AdminsService);

    const admin = await adminsService.create({
      name: 'admin',
      password: 'admin1234567890',
    });

    await app.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  process.exit(1);
});
