
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { AdminModule } from '../admin/admin.module';
import { StoreModule } from '../store/store.module';
import { UserModule } from '../user/user.module';
import { ItemModule } from '../item/item.module';
import { GiftOrder } from 'src/model';
import { GiftExchangeModule } from '../gift-exchange/gift-exchange.module';
import { GiftOrderService } from './gift-order.service';
import { GiftOrderController } from './gift-order.controller';

@Module({
    imports: [JwtModule.register(jwtConfig), GiftExchangeModule, ItemModule, UserModule, TypeOrmModule.forFeature([GiftOrder]), AdminModule, StoreModule],
    providers: [GiftOrderService],
    controllers: [GiftOrderController],
    exports: [GiftOrderService]
})
export class GiftOrderModule { }