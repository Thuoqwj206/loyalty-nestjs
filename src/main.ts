import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import 'dotenv/config'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir('src/views');
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  });
}

bootstrap();