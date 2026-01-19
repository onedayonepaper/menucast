import { PrismaService } from '../prisma/prisma.service';
import { DevicesService } from '../devices/devices.service';
export declare class PlayerService {
    private readonly prisma;
    private readonly devices;
    constructor(prisma: PrismaService, devices: DevicesService);
    manifest(deviceTokenPlain: string): Promise<{
        storeId: string;
        deviceId: string;
        version: number;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
        callEnabled: boolean;
        callListSize: number;
        playlist: {
            id: string | null;
            name: string | null;
            items: {
                playlistItemId: string;
                sortOrder: number;
                durationSec: number | null;
                asset: {
                    id: string;
                    type: import("@prisma/client").$Enums.AssetType;
                    url: string;
                    filename: string;
                    size: number;
                    durationSec: number | null;
                };
            }[];
        };
    }>;
    recentCalls(deviceTokenPlain: string, limit: number): Promise<{
        id: string;
        action: import("@prisma/client").$Enums.CallAction;
        number: number;
        ts: string;
    }[]>;
}
