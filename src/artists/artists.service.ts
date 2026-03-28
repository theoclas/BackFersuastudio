import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto, UpdateArtistDto, CreateSpecDto } from './dto/artist.dto';

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

  async update(user: any, slug: string, dto: UpdateArtistDto) {
    const artist = await this.findBySlug(slug);
    
    const hasPermission = user.artists.some((a: any) => a.id === artist.id);
    if (!hasPermission) {
      throw new UnauthorizedException('No tienes permisos para editar este perfil.');
    }
    
    return this.prisma.artist.update({ where: { slug }, data: dto });
  }

  async remove(slug: string) {
    await this.findBySlug(slug);
    return this.prisma.artist.update({ where: { slug }, data: { isActive: false } });
  }

  // ==== SPECS ====
  async addSpec(user: any, slug: string, dto: CreateSpecDto) {
    const artist = await this.findBySlug(slug);
    
    const hasPermission = user.artists.some((a: any) => a.id === artist.id);
    if (!hasPermission) {
      throw new UnauthorizedException('No tienes permisos para agregar specs.');
    }

    return this.prisma.spec.create({
      data: {
        label: dto.label,
        category: dto.category,
        artistId: artist.id,
      },
    });
  }

  async removeSpec(user: any, slug: string, specId: number) {
    const artist = await this.findBySlug(slug);
    
    const hasPermission = user.artists.some((a: any) => a.id === artist.id);
    if (!hasPermission) {
      throw new UnauthorizedException('No tienes permisos para eliminar specs.');
    }

    // Verify spec exists and belongs to artist
    const spec = await this.prisma.spec.findUnique({ where: { id: specId } });
    if (!spec || spec.artistId !== artist.id) {
      throw new NotFoundException('Spec no encontrado o no pertenece a este artista.');
    }

    return this.prisma.spec.delete({ where: { id: specId } });
  }
}
