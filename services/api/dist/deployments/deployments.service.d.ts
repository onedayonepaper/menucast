import { PrismaService } from '../prisma/prisma.service';
export declare class DeploymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCurrent(storeId: string): Promise<({
        deployment: {
            playlist: {
                storeId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            storeId: string;
            id: string;
            createdAt: Date;
            layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
            playlistId: string;
            version: number;
            targetType: import("@prisma/client").$Enums.DeploymentTargetType;
            targetDeviceId: string | null;
        };
    } & {
        storeId: string;
        updatedAt: Date;
        deploymentId: string;
        version: number;
    }) | null>;
    create(storeId: string, dto: {
        targetType: 'STORE_ALL' | 'DEVICE';
        targetDeviceId?: string;
        playlistId: string;
        layoutPreset: 'SPLIT2' | 'SPLIT3_CALL_1450x1080' | 'FULLSCREEN';
    }): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
        playlistId: string;
        version: number;
        targetType: import("@prisma/client").$Enums.DeploymentTargetType;
        targetDeviceId: string | null;
    }>;
    rollback(storeId: string, toVersion: number): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
        playlistId: string;
        version: number;
        targetType: import("@prisma/client").$Enums.DeploymentTargetType;
        targetDeviceId: string | null;
    }>;
}
