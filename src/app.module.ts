import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.providers';
import { AdminModule } from './module/admin/admin.module';
import { GiftModule } from './module/gift/gift.module';
import { ItemModule } from './module/item/item.module';
import { OrderItemModule } from './module/order-item/order-item.module';
import { OrderModule } from './module/order/order.module';
import { StoreModule } from './module/store/store.module';
import { UserModule } from './module/user/user.module';
import { IoRedisModule } from './services/redis/redis.module';
import { GiftOrderModule } from './module/gift-order/gift-order.module';
@Module({
  imports: [DatabaseModule, OrderItemModule, IoRedisModule, ItemModule, OrderModule, UserModule, AdminModule, GiftOrderModule, StoreModule, GiftModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
