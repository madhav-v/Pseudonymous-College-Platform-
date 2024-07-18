import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.model";

@Entity()
export class Org {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  website: string;

  @Column({ nullable: true })
  details: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  mainPic: string;

  @Column("simple-array", { nullable: true })
  otherPics: string[];

  @Column({ nullable: true })
  orgsVideo: string;

  @OneToMany(() => User, (user) => user.org)
  users: User[];
}
