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
exports.ArtistsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArtistsService = class ArtistsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.artist.findMany({
            where: { isActive: true },
            include: {
                genres: true,
                socials: true,
                events: {
                    where: { status: 'UPCOMING' },
                    orderBy: { date: 'asc' },
                    take: 5,
                },
                photos: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
                specs: true,
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async findBySlug(slug) {
        const artist = await this.prisma.artist.findUnique({
            where: { slug },
            include: {
                genres: true,
                socials: true,
                events: {
                    where: { status: 'UPCOMING' },
                    orderBy: { date: 'asc' },
                },
                photos: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                },
                specs: true,
            },
        });
        if (!artist)
            throw new common_1.NotFoundException(`Artista '${slug}' no encontrado`);
        return artist;
    }
    async create(dto) {
        const exists = await this.prisma.artist.findUnique({ where: { slug: dto.slug } });
        if (exists)
            throw new common_1.ConflictException(`El slug '${dto.slug}' ya existe`);
        return this.prisma.artist.create({ data: dto });
    }
    async update(user, slug, dto) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para editar este perfil.');
        }
        return this.prisma.artist.update({ where: { slug }, data: dto });
    }
    async remove(slug) {
        await this.findBySlug(slug);
        return this.prisma.artist.update({ where: { slug }, data: { isActive: false } });
    }
    async addSpec(user, slug, dto) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para agregar specs.');
        }
        return this.prisma.spec.create({
            data: {
                label: dto.label,
                category: dto.category,
                artistId: artist.id,
            },
        });
    }
    async removeSpec(user, slug, specId) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para eliminar specs.');
        }
        const spec = await this.prisma.spec.findUnique({ where: { id: specId } });
        if (!spec || spec.artistId !== artist.id) {
            throw new common_1.NotFoundException('Spec no encontrado o no pertenece a este artista.');
        }
        return this.prisma.spec.delete({ where: { id: specId } });
    }
    async addSocial(user, slug, dto) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para agregar redes sociales.');
        }
        return this.prisma.social.create({
            data: {
                platform: dto.platform,
                url: dto.url,
                label: dto.label,
                artistId: artist.id,
            },
        });
    }
    async removeSocial(user, slug, socialId) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para eliminar redes sociales.');
        }
        const social = await this.prisma.social.findUnique({ where: { id: socialId } });
        if (!social || social.artistId !== artist.id) {
            throw new common_1.NotFoundException('Red social no encontrada o no pertenece a este artista.');
        }
        return this.prisma.social.delete({ where: { id: socialId } });
    }
    async addPhoto(user, slug, url) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para subir fotos.');
        }
        return this.prisma.photo.create({
            data: {
                url,
                artistId: artist.id,
            },
        });
    }
    async removePhoto(user, slug, photoId) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para eliminar fotos.');
        }
        const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
        if (!photo || photo.artistId !== artist.id) {
            throw new common_1.NotFoundException('Foto no encontrada o no pertenece a este artista.');
        }
        return this.prisma.photo.delete({ where: { id: photoId } });
    }
    async uploadCover(user, slug, url) {
        const artist = await this.findBySlug(slug);
        const hasPermission = user.artists.some((a) => a.id === artist.id);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para cambiar la foto de portada.');
        }
        return this.prisma.artist.update({
            where: { id: artist.id },
            data: { coverImage: url },
        });
    }
};
exports.ArtistsService = ArtistsService;
exports.ArtistsService = ArtistsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArtistsService);
//# sourceMappingURL=artists.service.js.map