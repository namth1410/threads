import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ThreadEntity } from '../threads/thread.entity';
import { CommentEntity } from '../comments/comment.entity';
import { LikeEntity } from '../likes/like.entity';
import { FollowerEntity } from '../followers/follower.entity';
import { Role } from 'src/common/enums/role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 1 }) // Mặc định là 1 khi user được tạo
  tokenVersion: number;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  displayId: string;

  @OneToMany(() => ThreadEntity, (thread) => thread.user)
  threads: ThreadEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToMany(() => FollowerEntity, (follower) => follower.follower)
  followers: FollowerEntity[];

  @OneToMany(() => FollowerEntity, (follower) => follower.followed)
  following: FollowerEntity[];

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
