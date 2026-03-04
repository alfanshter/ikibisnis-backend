import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Wraps every successful response in a consistent envelope:
 * { success, statusCode, message, data, timestamp, path }
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<{ url: string }>();
    const statusCode = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>().statusCode;

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ??
      'Success';

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
