import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.providers';
import { AdminModule } from './module/admin/admin.module';
import { StoreModule } from './module/store/store.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule, AdminModule, StoreModule, ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
