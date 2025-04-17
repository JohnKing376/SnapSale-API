import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Request from 'express';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { GetUserData } from '../interfaces/get-user-data.inteface';

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    return request[REQUEST_USER_KEY] as GetUserData;
  },
);
