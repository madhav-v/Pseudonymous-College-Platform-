import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post.model";
import { User } from "./User.model";


@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;

}