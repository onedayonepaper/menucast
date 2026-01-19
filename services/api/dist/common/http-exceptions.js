"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = exports.ConflictException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.ApiHttpException = void 0;
const common_1 = require("@nestjs/common");
const api_response_1 = require("./api-response");
class ApiHttpException extends common_1.HttpException {
    constructor(status, code, message) {
        super((0, api_response_1.err)(code, message), status);
    }
}
exports.ApiHttpException = ApiHttpException;
class BadRequestException extends ApiHttpException {
    constructor(message = 'Bad request') {
        super(common_1.HttpStatus.BAD_REQUEST, 'BAD_REQUEST', message);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends ApiHttpException {
    constructor(message = 'Unauthorized') {
        super(common_1.HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', message);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends ApiHttpException {
    constructor(message = 'Forbidden') {
        super(common_1.HttpStatus.FORBIDDEN, 'FORBIDDEN', message);
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends ApiHttpException {
    constructor(message = 'Not found') {
        super(common_1.HttpStatus.NOT_FOUND, 'NOT_FOUND', message);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends ApiHttpException {
    constructor(message = 'Conflict') {
        super(common_1.HttpStatus.CONFLICT, 'CONFLICT', message);
    }
}
exports.ConflictException = ConflictException;
class InternalServerException extends ApiHttpException {
    constructor(message = 'Internal server error') {
        super(common_1.HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL', message);
    }
}
exports.InternalServerException = InternalServerException;
//# sourceMappingURL=http-exceptions.js.map