
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { AdminModule } from '../admin/admin.module';
import { StoreModule } from '../store/store.module';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import { ItemModule } from '../item/item.module';
import { OrderItem } from 'src/model';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [JwtModule.register(jwtConfig), TypeOrmModule.forFeature([OrderItem]), AdminModule, StoreModule],
    providers: [OrderItemService],
    controllers: [OrderItemController],
    exports: [OrderItemService]
})
export class OrderItemModule { }