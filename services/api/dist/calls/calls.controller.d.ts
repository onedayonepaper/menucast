import { CallsService } from './calls.service';
import { CallDto, ResetDto } from './calls.dto';
export declare class CallsController {
    private readonly calls;
    constructor(calls: CallsService);
    next(req: any): Promise<import("../common/api-response").ApiOk<{
        number: number;
    }>>;
    call(req: any, dto: CallDto): Promise<import("../common/api-response").ApiOk<{
        number: number;
    }>>;
    recall(req: any, dto: CallDto): Promise<import("../common/api-response").ApiOk<{
        number: number;
    }>>;
    reset(req: any, dto: ResetDto): Promise<import("../common/api-response").ApiOk<{
        toNumber: number;
    }>>;
}
