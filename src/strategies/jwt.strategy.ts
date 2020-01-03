import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { UsersService } from '../modules/users/users.service';
import { jwtConstant } from 'src/constants/jwt.constants';
import { JwtPayloadInterface } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.secret,
    });
  }

  async validate(payload: JwtPayloadInterface, done: VerifiedCallback) {
    const { username } = payload;
    const entity = await this.usersService.findUserByUsername(username);
    if (!entity) {
      throw new UnauthorizedException('该用户不存在');
    }
    done(null, entity);
  }
}
