
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { AdminModule } from '../admin/admin.module';
import { StoreModule } from '../store/store.module';
import { GiftExchangeController } from './gift-exchange.controller';
import { GiftExchangeService } from './gift-exchange.service';
import { ItemModule } from '../item/item.module';
import { GiftExchange } from 'src/model';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [JwtModule.register(jwtConfig), TypeOrmModule.forFeature([GiftExchange]), AdminModule, StoreModule],
    providers: [GiftExchangeService],
    controllers: [GiftExchangeController],
    exports: [GiftExchangeService]
})
export class GiftExchangeModule { }