
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { Order } from 'src/model/order.model';
import { AdminModule } from '../admin/admin.module';
import { StoreModule } from '../store/store.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { ItemModule } from '../item/item.module';
import { CacheModule } from '@nestjs/cache-manager';
import { IoRedisModule } from 'src/services/redis/redis.module';

@Module({
    imports: [JwtModule.register(jwtConfig), IoRedisModule, CacheModule.register(), OrderItemModule, ItemModule, UserModule, TypeOrmModule.forFeature([Order]), AdminModule, StoreModule],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule { }