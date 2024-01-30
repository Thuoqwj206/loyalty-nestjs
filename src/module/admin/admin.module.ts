
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from 'src/model/admin.model';

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    providers: [AdminService,],
    controllers: [AdminsController],
    exports: [AdminService]
})
export class AdminModule { }