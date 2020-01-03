import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { AccountService } from './account.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('account')
@ApiTags('登录注册模块')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('login')
  @ApiOperation({ summary: '登录' })
  async login(@Body() data: LoginDto) {
    return await this.accountService.login(data);
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() data: RegisterDto) {
    return await this.accountService.register(data);
  }

  @Get('register/:email/code')
  @ApiOperation({ summary: '发送验证码' })
  async sendCode(@Param('email') email: string) {
    return await this.accountService.sendCode(email);
  }
}
