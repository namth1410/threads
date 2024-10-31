import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { CommentsModule } from './comments/comments.module';
import { DbModule } from './db/db.module';
import { FollowersModule } from './followers/followers.module';
import { LikesModule } from './likes/likes.module';
import { MinioModule } from './minio/minio.module';
import { SessionsModule } from './sessions/sessions.module';
import { ThreadsModule } from './threads/threads.module';
import { UsersModule } from './users/users.module';

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
    // RedisModule.forRoot({
    //   type: 'single',
    //   url: 'redis://36.50.176.49:6379',
    // }),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
