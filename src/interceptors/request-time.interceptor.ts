import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class RequestTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    if (context.getType() !== 'http') {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
        map(data => {
          const elapsedTime = Date.now() - startTime;
          response.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);

          if (data && typeof data === 'object') {
            if ('view' in data) {
              return {
                ...data,
                elapsedTime,
                locals: {
                  ...(data.locals || {}),
                  elapsedTime
                }
              };
            }

            return {
              ...data,
              elapsedTime
            };
          }

          return {
            data,
            elapsedTime
          };
        }),
        catchError(error => {
          const elapsedTime = Date.now() - startTime;
          response.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
          throw error;
        })
    );
  }
}
