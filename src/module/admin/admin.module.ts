
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from 'src/model/admin.model';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';
import { IoRedisModule } from 'src/services/redis/redis.module';

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), IoRedisModule, UserModule, StoreModule],
    providers: [AdminService,],
    controllers: [AdminsController],
    exports: [AdminService]
})
export class AdminModule { }