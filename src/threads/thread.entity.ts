import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CommentEntity } from '../comments/comment.entity';
import { LikeEntity } from '../likes/like.entity';
import { MediaEntity } from 'src/minio/media.entity';
import { Visibility } from './enums/visibility.enum';

@Entity('threads')
export class ThreadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.threads)
  user: UserEntity;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @OneToMany(() => CommentEntity, (comment) => comment.thread)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.thread)
  likes: LikeEntity[];

  @OneToMany(() => MediaEntity, (media) => media.thread, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: MediaEntity[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
