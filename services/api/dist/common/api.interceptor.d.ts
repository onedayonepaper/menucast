import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
export declare class ApiWrapInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): any;
}
