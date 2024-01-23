
import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AdminsController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from 'src/model/admin.model';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    providers: [AdminService,],
    controllers: [AdminsController],
    exports: [AdminService]
})
export class AdminModule { }