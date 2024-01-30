
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { Item } from 'src/model/item.model';
import { AdminModule } from '../admin/admin.module';
import { StoreModule } from '../store/store.module';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { IoRedisModule } from 'src/services/redis/redis.module';

@Module({
    imports: [JwtModule.register(jwtConfig), IoRedisModule, CacheModule.register(), TypeOrmModule.forFeature([Item]), AdminModule, StoreModule],
    providers: [ItemService],
    controllers: [ItemController],
    exports: [ItemService]
})
export class ItemModule { }