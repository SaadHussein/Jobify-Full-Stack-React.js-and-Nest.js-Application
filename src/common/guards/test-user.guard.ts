import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class TestUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.testUser) {
      throw new BadRequestException('Demo User. Read Only!');
    }

    return true;
  }
}
