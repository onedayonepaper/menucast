import { PrismaService } from '../prisma/prisma.service';
export declare class PlaylistsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(storeId: string, name: string): Promise<{
        storeId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    get(storeId: string, id: string): Promise<{
        items: ({
            asset: {
                storeId: string;
                id: string;
                createdAt: Date;
                type: import("@prisma/client").$Enums.AssetType;
                url: string;
                filename: string;
                size: number;
                durationSec: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            durationSec: number | null;
            playlistId: string;
            assetId: string;
            sortOrder: number;
        })[];
    } & {
        storeId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    addItem(storeId: string, playlistId: string, assetId: string, sortOrder: number, durationSec?: number): Promise<{
        id: string;
        createdAt: Date;
        durationSec: number | null;
        playlistId: string;
        assetId: string;
        sortOrder: number;
    }>;
    reorder(storeId: string, playlistId: string, items: {
        playlistItemId: string;
        sortOrder: number;
    }[]): Promise<{
        updated: boolean;
    }>;
    removeItem(storeId: string, playlistId: string, playlistItemId: string): Promise<{
        deleted: boolean;
    }>;
}
