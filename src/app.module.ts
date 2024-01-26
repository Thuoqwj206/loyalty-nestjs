import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.providers';
import { AdminModule } from './module/admin/admin.module';
import { ItemModule } from './module/item/item.module';
import { OrderModule } from './module/order/order.module';
import { StoreModule } from './module/store/store.module';
import { UserModule } from './module/user/user.module';
import { OrderItemModule } from './module/order-item/order-item.module';
import { RedisModule } from 'nestjs-redis';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [DatabaseModule, OrderItemModule, ItemModule, OrderModule, UserModule, AdminModule, StoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // RedisModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => configService.get('redis'),
    //   inject: [ConfigService]
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
