
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { MailModule } from 'src/mail/mail.module';
import { Store } from 'src/model/store.model';
import { IoRedisModule } from 'src/services/redis/redis.module';
import { UserModule } from '../user/user.module';
import { StoresController } from './store.controller';
import { StoreService } from './store.service';
import { ItemModule } from '../item/item.module';
import { GiftModule } from '../gift/gift.module';

@Module({
    imports: [UserModule, IoRedisModule, JwtModule.register(jwtConfig), TypeOrmModule.forFeature([Store]), GiftModule, MailModule, ItemModule],
    providers: [StoreService],
    controllers: [StoresController],
    exports: [StoreService]
})
export class StoreModule { }