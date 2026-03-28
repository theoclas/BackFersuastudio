import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  async create(dto: CreateBookingDto) {
    // Buscar nombre del artista si se proporcionó
    let artistName: string | undefined;
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

    // Enviar emails de notificación
    try {
      await this.mail.sendBookingNotification({
        ...dto,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
        artistName,
      });
    } catch (err) {
      console.error('Error enviando email de booking:', err);
    }

    return { message: 'Solicitud de booking recibida exitosamente', id: booking.id };
  }

  async findAll(status?: string) {
    return this.prisma.booking.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        artist: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { artist: true },
    });
    if (!booking) throw new NotFoundException(`Booking ${id} no encontrado`);
    return booking;
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: dto,
    });
  }
}
