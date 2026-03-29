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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(artistSlug) {
        return this.prisma.event.findMany({
            where: artistSlug
                ? { artist: { slug: artistSlug } }
                : undefined,
            include: { artist: { select: { name: true, slug: true } } },
            orderBy: { date: 'asc' },
        });
    }
    async findUpcoming(artistSlug) {
        return this.prisma.event.findMany({
            where: {
                status: 'UPCOMING',
                date: { gte: new Date() },
                ...(artistSlug ? { artist: { slug: artistSlug } } : {}),
            },
            include: { artist: { select: { name: true, slug: true } } },
            orderBy: { date: 'asc' },
        });
    }
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: { artist: true },
        });
        if (!event)
            throw new common_1.NotFoundException(`Evento ${id} no encontrado`);
        return event;
    }
    async create(user, dto) {
        const hasPermission = user.artists.some((a) => a.id === dto.artistId);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para crear eventos para este artista.');
        }
        return this.prisma.event.create({
            data: {
                ...dto,
                date: new Date(dto.date),
            },
        });
    }
    async update(user, id, dto) {
        const event = await this.findOne(id);
        const hasPermission = user.artists.some((a) => a.id === event.artistId);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para editar este evento.');
        }
        return this.prisma.event.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.date ? { date: new Date(dto.date) } : {}),
            },
        });
    }
    async remove(user, id) {
        const event = await this.findOne(id);
        const hasPermission = user.artists.some((a) => a.id === event.artistId);
        if (!hasPermission) {
            throw new common_1.UnauthorizedException('No tienes permisos para eliminar este evento.');
        }
        return this.prisma.event.delete({ where: { id } });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map