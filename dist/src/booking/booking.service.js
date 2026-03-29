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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let BookingService = class BookingService {
    prisma;
    mail;
    constructor(prisma, mail) {
        this.prisma = prisma;
        this.mail = mail;
    }
    async create(dto) {
        let artistName;
        if (dto.artistId) {
            const artist = await this.prisma.artist.findUnique({
                where: { id: dto.artistId },
                select: { name: true },
            });
            artistName = artist?.name;
        }
        const booking = await this.prisma.booking.create({
            data: {
                ...dto,
                ...(dto.eventDate ? { eventDate: new Date(dto.eventDate) } : {}),
            },
        });
        try {
            await this.mail.sendBookingNotification({
                ...dto,
                eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
                artistName,
            });
        }
        catch (err) {
            console.error('Error enviando email de booking:', err);
        }
        return { message: 'Solicitud de booking recibida exitosamente', id: booking.id };
    }
    async findAll(status) {
        return this.prisma.booking.findMany({
            where: status ? { status: status } : undefined,
            include: {
                artist: { select: { name: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { artist: true },
        });
        if (!booking)
            throw new common_1.NotFoundException(`Booking ${id} no encontrado`);
        return booking;
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        return this.prisma.booking.update({
            where: { id },
            data: dto,
        });
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], BookingService);
//# sourceMappingURL=booking.service.js.map