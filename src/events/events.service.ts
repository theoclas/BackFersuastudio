import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

type AuthUser = { role: UserRole; artists: { id: string }[] };

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  private canManageArtist(user: AuthUser, artistId: string): boolean {
    if (user.role === UserRole.ADMIN) return true;
    return user.artists.some((a) => a.id === artistId);
  }

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

  async create(user: AuthUser, dto: CreateEventDto) {
    if (!this.canManageArtist(user, dto.artistId)) {
      throw new UnauthorizedException('No tienes permisos para crear eventos para este artista.');
    }

    return this.prisma.event.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async update(user: AuthUser, id: string, dto: UpdateEventDto) {
    const event = await this.findOne(id);

    if (!this.canManageArtist(user, event.artistId)) {
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

  async remove(user: AuthUser, id: string) {
    const event = await this.findOne(id);

    if (!this.canManageArtist(user, event.artistId)) {
      throw new UnauthorizedException('No tienes permisos para eliminar este evento.');
    }

    return this.prisma.event.delete({ where: { id } });
  }
}
