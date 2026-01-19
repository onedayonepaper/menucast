import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ApiOk, ok } from './api-response';

@Injectable()
export class ApiWrapInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(
      map((data: any) => {
        if (data && typeof data === 'object' && 'ok' in data) return data;
        return ok(data) as ApiOk<any>;
      }),
    );
  }
}
