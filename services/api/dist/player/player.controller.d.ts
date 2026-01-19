import { PlayerService } from './player.service';
export declare class PlayerController {
    private readonly player;
    constructor(player: PlayerService);
    manifest(token: string | undefined): Promise<import("../common/api-response").ApiOk<{
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
    }>>;
    recent(token: string | undefined, limitStr: string | undefined): Promise<import("../common/api-response").ApiOk<{
        id: string;
        action: import("@prisma/client").$Enums.CallAction;
        number: number;
        ts: string;
    }[]>>;
}
