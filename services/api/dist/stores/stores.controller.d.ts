import { StoresService } from './stores.service';
import { PatchSettingsDto } from './stores.dto';
export declare class StoresController {
    private readonly stores;
    constructor(stores: StoresService);
    me(req: any): Promise<import("../common/api-response").ApiOk<{
        id: string;
        name: string;
        callEnabled: boolean;
        callListSize: number;
        callStartNo: number;
        callNextNo: number;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
    }>>;
    patch(req: any, dto: PatchSettingsDto): Promise<import("../common/api-response").ApiOk<{
        id: string;
        callEnabled: boolean;
        callListSize: number;
        callStartNo: number;
        callNextNo: number;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
    }>>;
}
