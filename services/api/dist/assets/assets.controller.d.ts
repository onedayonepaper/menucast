import { AssetsService } from './assets.service';
export declare class AssetsController {
    private readonly assets;
    constructor(assets: AssetsService);
    upload(req: any, file: Express.Multer.File): Promise<import("../common/api-response").ApiOk<{
        storeId: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AssetType;
        url: string;
        filename: string;
        size: number;
        durationSec: number | null;
    }>>;
    list(req: any): Promise<import("../common/api-response").ApiOk<{
        storeId: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AssetType;
        url: string;
        filename: string;
        size: number;
        durationSec: number | null;
    }[]>>;
    remove(req: any, id: string): Promise<import("../common/api-response").ApiOk<{
        deleted: boolean;
    }>>;
}
