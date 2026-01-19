import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorCode, err } from './api-response';

export class ApiHttpException extends HttpException {
  constructor(status: number, code: ApiErrorCode, message: string) {
    super(err(code, message), status);
  }
}

export class BadRequestException extends ApiHttpException {
  constructor(message = 'Bad request') {
    super(HttpStatus.BAD_REQUEST, 'BAD_REQUEST', message);
  }
}

export class UnauthorizedException extends ApiHttpException {
  constructor(message = 'Unauthorized') {
    super(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', message);
  }
}

export class ForbiddenException extends ApiHttpException {
  constructor(message = 'Forbidden') {
    super(HttpStatus.FORBIDDEN, 'FORBIDDEN', message);
  }
}

export class NotFoundException extends ApiHttpException {
  constructor(message = 'Not found') {
    super(HttpStatus.NOT_FOUND, 'NOT_FOUND', message);
  }
}

export class ConflictException extends ApiHttpException {
  constructor(message = 'Conflict') {
    super(HttpStatus.CONFLICT, 'CONFLICT', message);
  }
}

export class InternalServerException extends ApiHttpException {
  constructor(message = 'Internal server error') {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL', message);
  }
}
