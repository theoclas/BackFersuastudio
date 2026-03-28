import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

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

  async findBySlug(slug: string) {
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

    if (!artist) throw new NotFoundException(`Artista '${slug}' no encontrado`);
    return artist;
  }

  async create(dto: CreateArtistDto) {
    const exists = await this.prisma.artist.findUnique({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(`El slug '${dto.slug}' ya existe`);

    return this.prisma.artist.create({ data: dto });
  }

  async update(slug: string, dto: UpdateArtistDto) {
    await this.findBySlug(slug);
    return this.prisma.artist.update({ where: { slug }, data: dto });
  }

  async remove(slug: string) {
    await this.findBySlug(slug);
    return this.prisma.artist.update({ where: { slug }, data: { isActive: false } });
  }
}
