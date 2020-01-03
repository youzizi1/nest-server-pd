import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { Reflector } from '@nestjs/core';
import { User } from 'src/modules/users/user.entity';
import { Possession } from 'src/enums/possession.enum';
import { PermissionInterface } from 'src/interfaces/permission.interface';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async validate(
    user: User,
    permissions: PermissionInterface[],
    resourceId: number,
  ) {
    const results = permissions.map(async permission => {
      const { resource, possession } = permission;

      let hasPossession: boolean = true;

      if (possession === Possession.OWN) {
        hasPossession = await this.usersService.userPossessResource(
          user.id,
          resource,
          resourceId,
        );
      }

      return hasPossession;
    });

    return Promise.all(results);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const permissions = this.reflector.get('permissions', context.getHandler());

    const result = await this.validate(
      request.user,
      permissions,
      Number(request.params.id),
    );

    return result.includes(true);
  }
}
