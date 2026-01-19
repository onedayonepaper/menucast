import { PrismaService } from '../prisma/prisma.service';
export declare class StoresService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStoreById(storeId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        callEnabled: boolean;
        callListSize: number;
        callStartNo: number;
        callNextNo: number;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
    }>;
    updateSettings(storeId: string, patch: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        callEnabled: boolean;
        callListSize: number;
        callStartNo: number;
        callNextNo: number;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
    }>;
}
