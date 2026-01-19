import { PrismaService } from '../prisma/prisma.service';
import { WsGateway } from '../ws/ws.gateway';
export declare class CallsService {
    private readonly prisma;
    private readonly ws;
    constructor(prisma: PrismaService, ws: WsGateway);
    private emit;
    recent(storeId: string, limit: number): Promise<{
        id: string;
        action: import("@prisma/client").$Enums.CallAction;
        number: number;
        ts: string;
    }[]>;
    next(storeId: string): Promise<{
        number: number;
    }>;
    call(storeId: string, number: number): Promise<{
        number: number;
    }>;
    recall(storeId: string, number: number): Promise<{
        number: number;
    }>;
    reset(storeId: string, toNumber: number): Promise<{
        toNumber: number;
    }>;
}
