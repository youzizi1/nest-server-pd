import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Code } from '../codes/code.entity';
import { User } from '../users/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created: Date;

  @CreateDateColumn()
  updated: Date;

  @ManyToOne(
    type => Code,
    code => code.comments,
  )
  code: Code;

  @ManyToOne(
    type => User,
    user => user.comments,
  )
  user: User;
}
