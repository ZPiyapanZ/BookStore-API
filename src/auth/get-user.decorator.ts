import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from 'src/users/users.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Users => {
    const req = ctx.switchToHttp().getRequest();
    const { password, ...user } = req.user;

    return user;
  },
);
