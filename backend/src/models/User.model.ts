import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Org } from "./Org.model";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: "enum",
    enum: ["parent", "student", "admin"],
    default: "student",
  })
  role: "parent" | "student" | "admin";

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: "timestamp", nullable: true })
  refreshTokenExpiresAt: Date;

  @ManyToOne(() => Org, (org) => org.users)
  org: Org;
}
