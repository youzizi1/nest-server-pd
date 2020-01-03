import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Code {
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
    type => User,
    user => user.codes,
  )
  user: User;

  @ManyToOne(
    type => Category,
    category => category.codes,
  )
  category: Category;

  @ManyToMany(
    type => User,
    user => user.likes,
  )
  liked: User[];

  @OneToMany(
    type => Comment,
    comment => comment.code,
  )
  comments: Comment[];
}
