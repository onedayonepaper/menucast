import { PrismaService } from '../prisma/prisma.service';
export declare class AssetsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upload(storeId: string, file: Express.Multer.File): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AssetType;
        url: string;
        filename: string;
        size: number;
        durationSec: number | null;
    }>;
    list(storeId: string): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AssetType;
        url: string;
        filename: string;
        size: number;
        durationSec: number | null;
    }[]>;
    remove(storeId: string, assetId: string): Promise<{
        deleted: boolean;
    }>;
}
