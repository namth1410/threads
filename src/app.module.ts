import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { FollowersModule } from './followers/followers.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { SessionsModule } from './sessions/sessions.module';
import { MinioModule } from './minio/minio.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    ThreadsModule,
    CommentsModule,
    LikesModule,
    FollowersModule,
    AuthModule,
    SessionsModule,
    MinioModule,
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://36.50.176.49:6379',
    }),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
