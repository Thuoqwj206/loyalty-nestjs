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
import { CacheModule } from '@nestjs/cache-manager';
import { GiftModule } from './module/gift/gift.module';
import * as redisStore from "cache-manager-redis-store";
import type { RedisClientOptions } from "redis";
import { IoRedisModule } from './services/redis/redis.module';
@Module({
  imports: [DatabaseModule, OrderItemModule, IoRedisModule, CacheModule.register({ isGlobal: true }), ItemModule, OrderModule, UserModule, AdminModule, StoreModule, GiftModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
