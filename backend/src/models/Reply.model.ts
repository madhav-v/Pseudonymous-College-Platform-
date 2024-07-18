import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment.model";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  author: string; // Pseudonym

  @Column()
  createdAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;
}