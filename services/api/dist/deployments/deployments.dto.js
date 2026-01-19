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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollbackDto = exports.CreateDeploymentDto = void 0;
const class_validator_1 = require("class-validator");
class CreateDeploymentDto {
    targetType;
    targetDeviceId;
    playlistId;
    layoutPreset;
}
exports.CreateDeploymentDto = CreateDeploymentDto;
__decorate([
    (0, class_validator_1.IsIn)(['STORE_ALL', 'DEVICE']),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "targetType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "targetDeviceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "playlistId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['SPLIT2', 'SPLIT3_CALL_1450x1080', 'FULLSCREEN']),
    __metadata("design:type", String)
], CreateDeploymentDto.prototype, "layoutPreset", void 0);
class RollbackDto {
    toVersion;
}
exports.RollbackDto = RollbackDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RollbackDto.prototype, "toVersion", void 0);
//# sourceMappingURL=deployments.dto.js.map