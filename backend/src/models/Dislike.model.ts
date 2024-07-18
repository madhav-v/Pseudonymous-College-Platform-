import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post.model";
import { User } from "./User.model";


@Entity()
export class Dislike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.dislikes)
  post: Post;

}