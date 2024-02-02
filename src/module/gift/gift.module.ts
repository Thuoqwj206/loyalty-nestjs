
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config';
import { Gift } from 'src/model';
import { IoRedisModule } from 'src/services/redis/redis.module';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';

@Module({
    imports: [JwtModule.register(jwtConfig), IoRedisModule, TypeOrmModule.forFeature([Gift])],
    providers: [GiftService],
    controllers: [GiftController],
    exports: [GiftService]
})
export class GiftModule { }