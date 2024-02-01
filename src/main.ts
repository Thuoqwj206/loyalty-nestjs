import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv/config';
import { join } from 'path';
import { AppModule } from './app.module';
import { RedisService } from 'src/services/redis/redis.service';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  });
}

bootstrap();
