import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User.model";
import { Like } from "./Like.model";
import { Dislike } from "./Dislike.model";
import { Comment } from "./Comment.model";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @Column({ nullable: true })
  media: string;

  @Column()
  createdAt: Date;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  dislikesCount: number;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.post)
  dislikes: Dislike[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
