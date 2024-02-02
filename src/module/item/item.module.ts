
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { Item } from 'src/model/item.model';
import { IoRedisModule } from 'src/services/redis/redis.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
    imports: [JwtModule.register(jwtConfig), IoRedisModule, TypeOrmModule.forFeature([Item])],
    providers: [ItemService],
    controllers: [ItemController],
    exports: [ItemService]
})
export class ItemModule { }