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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_image_config_1 = require("./multer-image.config");
const swagger_1 = require("@nestjs/swagger");
const artists_service_1 = require("./artists.service");
const artist_dto_1 = require("./dto/artist.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ArtistsController = class ArtistsController {
    artistsService;
    constructor(artistsService) {
        this.artistsService = artistsService;
    }
    findAll() {
        return this.artistsService.findAll();
    }
    findOne(slug) {
        return this.artistsService.findBySlug(slug);
    }
    create(dto) {
        return this.artistsService.create(dto);
    }
    update(slug, dto, req) {
        return this.artistsService.update(req.user, slug, dto);
    }
    remove(req, slug) {
        return this.artistsService.remove(req.user, slug);
    }
    addSpec(slug, dto, req) {
        return this.artistsService.addSpec(req.user, slug, dto);
    }
    removeSpec(slug, specId, req) {
        return this.artistsService.removeSpec(req.user, slug, specId);
    }
    addSocial(slug, dto, req) {
        return this.artistsService.addSocial(req.user, slug, dto);
    }
    removeSocial(slug, socialId, req) {
        return this.artistsService.removeSocial(req.user, slug, socialId);
    }
    addGenre(slug, dto, req) {
        return this.artistsService.addGenre(req.user, slug, dto);
    }
    removeGenre(slug, genreId, req) {
        return this.artistsService.removeGenre(req.user, slug, genreId);
    }
    async uploadPhoto(slug, file, req) {
        if (!file)
            throw new common_1.BadRequestException('Archivo de imagen requerido.');
        return this.artistsService.addPhoto(req.user, slug, `/uploads/artists/${file.filename}`);
    }
    removePhoto(slug, photoId, req) {
        return this.artistsService.removePhoto(req.user, slug, photoId);
    }
    async uploadCover(slug, file, req) {
        if (!file)
            throw new common_1.BadRequestException('Archivo de imagen requerido.');
        return this.artistsService.uploadCover(req.user, slug, `/uploads/artists/${file.filename}`);
    }
};
exports.ArtistsController = ArtistsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los artistas activos (público)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener artista por slug (público)' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear artista (solo administrador)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_dto_1.CreateArtistDto]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':slug'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar artista (admin)' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artist_dto_1.UpdateArtistDto, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':slug'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar artista (solo administrador)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':slug/specs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar Spec/Equipo al Rider del Artista' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artist_dto_1.CreateSpecDto, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "addSpec", null);
__decorate([
    (0, common_1.Delete)(':slug/specs/:specId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar Spec/Equipo del Rider' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('specId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "removeSpec", null);
__decorate([
    (0, common_1.Post)(':slug/socials'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar Red Social al Artista' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artist_dto_1.CreateSocialDto, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "addSocial", null);
__decorate([
    (0, common_1.Delete)(':slug/socials/:socialId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar Red Social' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('socialId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "removeSocial", null);
__decorate([
    (0, common_1.Post)(':slug/genres'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar Género Musical al Artista' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, artist_dto_1.CreateGenreDto, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "addGenre", null);
__decorate([
    (0, common_1.Delete)(':slug/genres/:genreId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar Género Musical' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('genreId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "removeGenre", null);
__decorate([
    (0, common_1.Post)(':slug/photos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Subir una foto a la galería del artista' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: multer_image_config_1.IMAGE_UPLOAD_MAX_BYTES },
        fileFilter: multer_image_config_1.imageFileFilter,
        storage: (0, multer_image_config_1.galleryDiskStorage)('file'),
    })),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ArtistsController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Delete)(':slug/photos/:photoId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una foto de la galería' }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('photoId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", void 0)
], ArtistsController.prototype, "removePhoto", null);
__decorate([
    (0, common_1.Post)(':slug/cover'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Subir la foto de portada principal del artista' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: multer_image_config_1.IMAGE_UPLOAD_MAX_BYTES },
        fileFilter: multer_image_config_1.imageFileFilter,
        storage: (0, multer_image_config_1.galleryDiskStorage)('cover'),
    })),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ArtistsController.prototype, "uploadCover", null);
exports.ArtistsController = ArtistsController = __decorate([
    (0, swagger_1.ApiTags)('Artists'),
    (0, common_1.Controller)('artists'),
    __metadata("design:paramtypes", [artists_service_1.ArtistsService])
], ArtistsController);
//# sourceMappingURL=artists.controller.js.map