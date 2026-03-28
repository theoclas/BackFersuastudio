import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async create(user: any, dto: CreateEventDto) {
    const hasPermission = user.artists.some((a: any) => a.id === dto.artistId);
    if (!hasPermission) {
      throw new UnauthorizedException('No tienes permisos para crear eventos para este artista.');
    }

    return this.prisma.event.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async update(user: any, id: string, dto: UpdateEventDto) {
    const event = await this.findOne(id);
    
    const hasPermission = user.artists.some((a: any) => a.id === event.artistId);
    if (!hasPermission) {
      throw new UnauthorizedException('No tienes permisos para editar este evento.');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.date ? { date: new Date(dto.date) } : {}),
      },
    });
  }

  async remove(user: any, id: string) {
    const event = await this.findOne(id);
    
    const hasPermission = user.artists.some((a: any) => a.id === event.artistId);
    if (!hasPermission) {
      throw new UnauthorizedException('No tienes permisos para eliminar este evento.');
    }

    return this.prisma.event.delete({ where: { id } });
  }
}
