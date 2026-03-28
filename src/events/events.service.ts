import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(artistSlug?: string) {
    return this.prisma.event.findMany({
      where: artistSlug
        ? { artist: { slug: artistSlug } }
        : undefined,
      include: { artist: { select: { name: true, slug: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async findUpcoming(artistSlug?: string) {
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

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { artist: true },
    });
    if (!event) throw new NotFoundException(`Evento ${id} no encontrado`);
    return event;
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findOne(id);
    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date ? { date: new Date(dto.date) } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.event.update({ where: { id }, data: { status: 'CANCELLED' } });
  }
}
