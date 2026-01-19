import { HttpException } from '@nestjs/common';
import { ApiErrorCode } from './api-response';
export declare class ApiHttpException extends HttpException {
    constructor(status: number, code: ApiErrorCode, message: string);
}
export declare class BadRequestException extends ApiHttpException {
    constructor(message?: string);
}
export declare class UnauthorizedException extends ApiHttpException {
    constructor(message?: string);
}
export declare class ForbiddenException extends ApiHttpException {
    constructor(message?: string);
}
export declare class NotFoundException extends ApiHttpException {
    constructor(message?: string);
}
export declare class ConflictException extends ApiHttpException {
    constructor(message?: string);
}
export declare class InternalServerException extends ApiHttpException {
    constructor(message?: string);
}
