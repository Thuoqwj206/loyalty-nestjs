
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { Order } from 'src/model/order.model';
import { IoRedisModule } from 'src/services/redis/redis.module';
import { AdminModule } from '../admin/admin.module';
import { ItemModule } from '../item/item.module';
import { OrderItemModule } from '../order-item/order-item.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [JwtModule.register(jwtConfig), IoRedisModule, OrderItemModule, ItemModule, UserModule, TypeOrmModule.forFeature([Order]), AdminModule, StoreModule],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule { }