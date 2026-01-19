"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = __importDefault(require("path"));
const prisma_module_1 = require("./prisma/prisma.module");
const ws_module_1 = require("./ws/ws.module");
const auth_module_1 = require("./auth/auth.module");
const stores_module_1 = require("./stores/stores.module");
const devices_module_1 = require("./devices/devices.module");
const assets_module_1 = require("./assets/assets.module");
const playlists_module_1 = require("./playlists/playlists.module");
const deployments_module_1 = require("./deployments/deployments.module");
const player_module_1 = require("./player/player.module");
const calls_module_1 = require("./calls/calls.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.default.resolve(process.env.UPLOAD_DIR ?? '../../data/uploads'),
                serveRoot: '/uploads',
            }),
            ws_module_1.WsModule,
            auth_module_1.AuthModule,
            stores_module_1.StoresModule,
            devices_module_1.DevicesModule,
            assets_module_1.AssetsModule,
            playlists_module_1.PlaylistsModule,
            deployments_module_1.DeploymentsModule,
            player_module_1.PlayerModule,
            calls_module_1.CallsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map