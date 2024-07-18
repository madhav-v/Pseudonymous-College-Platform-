import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post.model";
import { Reply } from "./Reply.model";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  author: string; // Pseudonym

  @Column()
  createdAt: Date;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Reply[];
}
