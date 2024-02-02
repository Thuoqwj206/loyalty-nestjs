import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import 'dotenv/config'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from 'src/config';
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => {
        return {
          config: {
            global: true,
            host: REDIS_HOST,
            port: REDIS_PORT,
            password: REDIS_PASSWORD,
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class IoRedisModule { }
