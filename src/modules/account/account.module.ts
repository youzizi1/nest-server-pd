import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/constants/jwt.constants';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { ConfigModule } from 'src/configs/config/config.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    ConfigModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
})
export class AccountModule {}
