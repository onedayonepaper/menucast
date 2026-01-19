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
exports.RemovePlaylistItemDto = exports.ReorderDto = exports.ReorderItemDto = exports.AddPlaylistItemDto = exports.CreatePlaylistDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreatePlaylistDto {
    name;
}
exports.CreatePlaylistDto = CreatePlaylistDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePlaylistDto.prototype, "name", void 0);
class AddPlaylistItemDto {
    assetId;
    sortOrder;
    durationSec;
}
exports.AddPlaylistItemDto = AddPlaylistItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPlaylistItemDto.prototype, "assetId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AddPlaylistItemDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddPlaylistItemDto.prototype, "durationSec", void 0);
class ReorderItemDto {
    playlistItemId;
    sortOrder;
}
exports.ReorderItemDto = ReorderItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReorderItemDto.prototype, "playlistItemId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ReorderItemDto.prototype, "sortOrder", void 0);
class ReorderDto {
    items;
}
exports.ReorderDto = ReorderDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReorderItemDto),
    __metadata("design:type", Array)
], ReorderDto.prototype, "items", void 0);
class RemovePlaylistItemDto {
    playlistItemId;
}
exports.RemovePlaylistItemDto = RemovePlaylistItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemovePlaylistItemDto.prototype, "playlistItemId", void 0);
//# sourceMappingURL=playlists.dto.js.map