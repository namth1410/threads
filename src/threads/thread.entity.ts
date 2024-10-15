import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CommentEntity } from '../comments/comment.entity';
import { LikeEntity } from '../likes/like.entity';

@Entity('threads')
export class ThreadEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.threads)
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.thread)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.thread)
  likes: LikeEntity[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
