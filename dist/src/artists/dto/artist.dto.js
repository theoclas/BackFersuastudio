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
exports.CreateGenreDto = exports.CreateSocialDto = exports.CreateSpecDto = exports.UpdateArtistDto = exports.CreateArtistDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateArtistDto {
    slug;
    name;
    tagline;
    bio;
    city;
    coverImage;
    headerImage;
    whatsapp;
}
exports.CreateArtistDto = CreateArtistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'macfly-mikebran' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mac Fly & Mike Bran' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'DJs · Medellín · Electronic' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "tagline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dúo de DJs originarios de Medellín...' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Medellín, Colombia' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "headerImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '573505209860' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArtistDto.prototype, "whatsapp", void 0);
class UpdateArtistDto {
    name;
    tagline;
    bio;
    city;
    coverImage;
    headerImage;
    whatsapp;
    isActive;
}
exports.UpdateArtistDto = UpdateArtistDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArtistDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArtistDto.prototype, "tagline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArtistDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArtistDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArtistDto.prototype, "coverImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArtistDto.prototype, "headerImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateArtistDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateArtistDto.prototype, "isActive", void 0);
class CreateSpecDto {
    label;
    category;
}
exports.CreateSpecDto = CreateSpecDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CDJ 3000' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecDto.prototype, "label", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CDJs' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpecDto.prototype, "category", void 0);
class CreateSocialDto {
    platform;
    url;
    label;
}
exports.CreateSocialDto = CreateSocialDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'instagram' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSocialDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://instagram.com/...' }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateSocialDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '@user' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSocialDto.prototype, "label", void 0);
class CreateGenreDto {
    name;
}
exports.CreateGenreDto = CreateGenreDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tech House' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGenreDto.prototype, "name", void 0);
//# sourceMappingURL=artist.dto.js.map