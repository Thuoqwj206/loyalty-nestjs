import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import 'dotenv/config'
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => {
        return {
          config: {
            global: true,
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class IoRedisModule { }
