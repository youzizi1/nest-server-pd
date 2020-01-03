import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { CommentDto } from './dtos/comment.dto';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
  ) {}

  /**
   * 创建评论
   * @param id 代码片段id
   * @param user 用户数据
   * @param data 评论数据
   */
  async createComment(id: number, user: User, data: CommentDto) {
    return await this.commentsRepo.save({
      user,
      code: { id },
      ...data,
    });
  }

  /**
   * 更新指定id的评论
   * @param id 评论id
   * @param data 评论数据
   */
  async updateComment(id: number, data: CommentDto) {
    const entity = await this.commentsRepo.findOne();
    if (!entity) {
      throw new NotFoundException('该评论不存在');
    }
    return await this.commentsRepo.save({
      ...entity,
      ...data,
    });
  }

  /**
   * 删除指定id的评论
   * @param id 评论id
   */
  async deleteComment(id: number) {
    return await this.commentsRepo.delete(id);
  }

  /**
   *获取指定id的代码片段的评论列表
   * @param id 代码片段id
   */
  async findCodeComments(id: number) {
    return await this.commentsRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.code', 'code')
      .where('code.id = :id', { id })
      .getMany();
  }

  /**
   * 获取指定id的用户的评论列表
   * @param id 用户id
   */
  async findUserComments(id: number) {
    return await this.commentsRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.code', 'code')
      .where('user.id = :id', { id })
      .getMany();
  }
}
