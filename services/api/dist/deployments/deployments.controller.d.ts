import { DeploymentsService } from './deployments.service';
import { CreateDeploymentDto, RollbackDto } from './deployments.dto';
import { WsGateway } from '../ws/ws.gateway';
export declare class DeploymentsController {
    private readonly deployments;
    private readonly ws;
    constructor(deployments: DeploymentsService, ws: WsGateway);
    create(req: any, dto: CreateDeploymentDto): Promise<import("../common/api-response").ApiOk<{
        storeId: string;
        id: string;
        createdAt: Date;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
        playlistId: string;
        version: number;
        targetType: import("@prisma/client").$Enums.DeploymentTargetType;
        targetDeviceId: string | null;
    }>>;
    rollback(req: any, dto: RollbackDto): Promise<import("../common/api-response").ApiOk<{
        storeId: string;
        id: string;
        createdAt: Date;
        layoutPreset: import("@prisma/client").$Enums.LayoutPreset;
        playlistId: string;
        version: number;
        targetType: import("@prisma/client").$Enums.DeploymentTargetType;
        targetDeviceId: string | null;
    }>>;
    current(req: any): Promise<import("../common/api-response").ApiOk<({
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
    }) | null>>;
}
