"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const http_exceptions_1 = require("../common/http-exceptions");
const uuid_1 = require("uuid");
function detectAssetType(mime) {
    if (mime.startsWith('image/'))
        return 'IMAGE';
    if (mime.startsWith('video/'))
        return 'VIDEO';
    return 'IMAGE';
}
let AssetsService = class AssetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upload(storeId, file) {
        const assetId = (0, uuid_1.v4)();
        const ext = path_1.default.extname(file.originalname || '').slice(1) || 'bin';
        const relDir = path_1.default.join(storeId);
        const absDir = path_1.default.resolve(process.env.UPLOAD_DIR ?? '../../data/uploads', relDir);
        await promises_1.default.mkdir(absDir, { recursive: true });
        const filename = `${assetId}.${ext}`;
        const absPath = path_1.default.join(absDir, filename);
        await promises_1.default.writeFile(absPath, file.buffer);
        const publicBase = process.env.PUBLIC_UPLOAD_BASE_URL ?? 'http://localhost:4000/uploads';
        const url = `${publicBase}/${storeId}/${filename}`;
        const created = await this.prisma.asset.create({
            data: {
                id: assetId,
                storeId,
                type: detectAssetType(file.mimetype),
                url,
                filename: file.originalname,
                size: file.size,
            },
        });
        return created;
    }
    async list(storeId) {
        return this.prisma.asset.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } });
    }
    async remove(storeId, assetId) {
        const asset = await this.prisma.asset.findFirst({ where: { id: assetId, storeId } });
        if (!asset)
            throw new http_exceptions_1.NotFoundException('Asset not found');
        const used = await this.prisma.playlistItem.findFirst({ where: { assetId } });
        if (used)
            throw new http_exceptions_1.ConflictException('Asset is used in a playlist');
        try {
            const publicBase = process.env.PUBLIC_UPLOAD_BASE_URL ?? 'http://localhost:4000/uploads';
            const rel = asset.url.replace(`${publicBase}/`, '');
            const abs = path_1.default.resolve(process.env.UPLOAD_DIR ?? '../../data/uploads', rel);
            await promises_1.default.unlink(abs);
        }
        catch { }
        await this.prisma.asset.delete({ where: { id: assetId } });
        return { deleted: true };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map