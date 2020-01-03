import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../../configs/config/config.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AccountService {
  private code: string;
  private email: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 登录
   * @param data 登录数据
   */
  async login(data: LoginDto) {
    const { username, password } = data;
    const entity = await this.usersService.findUserByUsername(username);
    if (!entity) {
      throw new BadRequestException('该用户不存在');
    }

    const passwordMatched = await entity.comparePassword(password);
    if (!passwordMatched) {
      throw new UnauthorizedException('密码错误');
    }

    const { id } = entity;
    const payload = { id, username };

    return {
      id,
      username,
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * 注册
   * @param data 注册数据
   */
  async register(data: RegisterDto) {
    const { username, email, code } = data;
    const entity = await this.usersService.findUserByUsername(username);
    if (entity) {
      throw new BadRequestException('该用户已存在');
    }

    if (this.code !== code || this.email !== email) {
      throw new BadRequestException('验证码错误');
    }

    return await this.usersService.createUser(data);
  }

  /**
   * 发送邮箱验证码
   * @param email 邮箱
   */
  async sendCode(email: string) {
    return await this.sendEmailCode(email);
  }

  /**
   * 发送邮箱验证码
   * @param email 邮箱
   */
  async sendEmailCode(email: string) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: Number(this.configService.get('EMAIL_PORT')),
      secure: this.configService.get('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });

    const code = String(this.generateCode());
    this.code = code;
    this.email = email;

    return await transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to: email,
      subject: '片段-验证码',
      text: `您的验证码是：${code}`,
    });
  }

  /**
   * 生成随机四位验证码
   */
  generateCode() {
    return 1000 + Math.round(Math.random() * 10000 - 1000);
  }
}
