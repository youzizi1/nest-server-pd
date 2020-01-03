import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Code } from '../codes/code.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  created: Date;

  @CreateDateColumn()
  updated: Date;

  @OneToMany(
    type => Code,
    code => code.user,
  )
  codes: Code[];

  @ManyToMany(
    type => Code,
    code => code.liked,
  )
  @JoinTable()
  likes: Code[];

  @ManyToMany(
    type => User,
    user => user.following,
  )
  @JoinTable()
  followers: User[];

  @ManyToMany(
    type => User,
    user => user.followers,
  )
  following: User[];

  @OneToMany(
    type => Comment,
    comment => comment.user,
  )
  comments: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
