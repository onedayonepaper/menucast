import { AddPlaylistItemDto, CreatePlaylistDto, RemovePlaylistItemDto, ReorderDto } from './playlists.dto';
import { PlaylistsService } from './playlists.service';
export declare class PlaylistsController {
    private readonly playlists;
    constructor(playlists: PlaylistsService);
    create(req: any, dto: CreatePlaylistDto): Promise<import("../common/api-response").ApiOk<{
        storeId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>>;
    get(req: any, id: string): Promise<import("../common/api-response").ApiOk<{
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
    }>>;
    addItem(req: any, id: string, dto: AddPlaylistItemDto): Promise<import("../common/api-response").ApiOk<{
        id: string;
        createdAt: Date;
        durationSec: number | null;
        playlistId: string;
        assetId: string;
        sortOrder: number;
    }>>;
    reorder(req: any, id: string, dto: ReorderDto): Promise<import("../common/api-response").ApiOk<{
        updated: boolean;
    }>>;
    removeItem(req: any, id: string, dto: RemovePlaylistItemDto): Promise<import("../common/api-response").ApiOk<{
        deleted: boolean;
    }>>;
}
