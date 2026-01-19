import { PrismaService } from '../prisma/prisma.service';
export declare class DevicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRegistrationCode(storeId: string): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        code: string;
        usedAt: Date | null;
    }>;
    registerDevice(code: string, name: string, screenProfile: string): Promise<{
        device: {
            storeId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            tokenHash: string;
            screenProfile: string;
            lastSeenAt: Date | null;
        };
        deviceToken: string;
    }>;
    listDevices(storeId: string): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tokenHash: string;
        screenProfile: string;
        lastSeenAt: Date | null;
    }[]>;
    findByTokenOrThrow(deviceTokenPlain: string): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tokenHash: string;
        screenProfile: string;
        lastSeenAt: Date | null;
    }>;
    heartbeat(deviceTokenPlain: string, _payload: any): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        tokenHash: string;
        screenProfile: string;
        lastSeenAt: Date | null;
    }>;
}
