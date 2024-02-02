
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { OrderItem } from 'src/model';
import { AdminModule } from '../admin/admin.module';
import { StoreModule } from '../store/store.module';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

@Module({
    imports: [JwtModule.register(jwtConfig), TypeOrmModule.forFeature([OrderItem])],
    providers: [OrderItemService],
    controllers: [OrderItemController],
    exports: [OrderItemService]
})
export class OrderItemModule { }