
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { AdminModule } from '../admin/admin.module';
import { StoreModule } from '../store/store.module';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { Gift } from 'src/model';
import { CacheModule } from '@nestjs/cache-manager';
import { IoRedisModule } from 'src/services/redis/redis.module';

@Module({
    imports: [JwtModule.register(jwtConfig), IoRedisModule, CacheModule.register(), TypeOrmModule.forFeature([Gift]), AdminModule, StoreModule],
    providers: [GiftService],
    controllers: [GiftController],
    exports: [GiftService]
})
export class GiftModule { }