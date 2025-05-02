import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RESPONSE_META_KEY } from '../constants/response-meta.constants';
import IResponseMeta from '../interfaces/response-meta.interface';
import { IApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class DataResponseInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  constructor(
    /**
     * Import Reflector
     */
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const meta =
      this.reflector.get<IResponseMeta>(
        RESPONSE_META_KEY,
        context.getHandler(),
      ) ?? {};

    return next.handle().pipe(
      map((data) => {
        if (
          (data as IApiResponse<T>)?.statusCode &&
          (data as IApiResponse<T>)?.message &&
          (data as IApiResponse<T>)?.data
        ) {
          return data;
        }

        return {
          statusCode: meta.statusCode || 200,
          message: meta.message,
          data,
        };
      }),
    );
  }
}
