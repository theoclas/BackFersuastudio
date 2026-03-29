import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto, UpdateArtistDto, CreateSpecDto, CreateSocialDto } from './dto/artist.dto';

type AuthUser = { role: UserRole; artists: { id: string }[] };

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  private canManageArtist(user: AuthUser, artistId: string): boolean {
    if (user.role === UserRole.ADMIN) return true;
    return user.artists.some((a) => a.id === artistId);
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

  async update(user: AuthUser, slug: string, dto: UpdateArtistDto) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para editar este perfil.');
    }
    
    return this.prisma.artist.update({ where: { slug }, data: dto });
  }

  async remove(user: AuthUser, slug: string) {
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Solo un administrador puede desactivar artistas.');
    }
    await this.findBySlug(slug);
    return this.prisma.artist.update({ where: { slug }, data: { isActive: false } });
  }

  // ==== SPECS ====
  async addSpec(user: AuthUser, slug: string, dto: CreateSpecDto) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
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

  async removeSpec(user: AuthUser, slug: string, specId: number) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para eliminar specs.');
    }

    // Verify spec exists and belongs to artist
    const spec = await this.prisma.spec.findUnique({ where: { id: specId } });
    if (!spec || spec.artistId !== artist.id) {
      throw new NotFoundException('Spec no encontrado o no pertenece a este artista.');
    }

    return this.prisma.spec.delete({ where: { id: specId } });
  }

  // ==== SOCIALS ====
  async addSocial(user: AuthUser, slug: string, dto: CreateSocialDto) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para agregar redes sociales.');
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

  async removeSocial(user: AuthUser, slug: string, socialId: number) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para eliminar redes sociales.');
    }

    const social = await this.prisma.social.findUnique({ where: { id: socialId } });
    if (!social || social.artistId !== artist.id) {
      throw new NotFoundException('Red social no encontrada o no pertenece a este artista.');
    }

    return this.prisma.social.delete({ where: { id: socialId } });
  }

  // ==== GENRES ====
  async addGenre(user: AuthUser, slug: string, dto: import('./dto/artist.dto').CreateGenreDto) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para agregar géneros.');
    }

    return this.prisma.genre.create({
      data: {
        name: dto.name,
        artistId: artist.id,
      },
    });
  }

  async removeGenre(user: AuthUser, slug: string, genreId: number) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para eliminar géneros.');
    }

    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre || genre.artistId !== artist.id) {
      throw new NotFoundException('Género no encontrado o no pertenece a este artista.');
    }

    return this.prisma.genre.delete({ where: { id: genreId } });
  }

  // ==== PHOTOS ====
  async addPhoto(user: AuthUser, slug: string, url: string) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para subir fotos.');
    }

    return this.prisma.photo.create({
      data: {
        url,
        artistId: artist.id,
      },
    });
  }

  async removePhoto(user: AuthUser, slug: string, photoId: number) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para eliminar fotos.');
    }

    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo || photo.artistId !== artist.id) {
      throw new NotFoundException('Foto no encontrada o no pertenece a este artista.');
    }

    if (photo.url.startsWith('/uploads/')) {
      const abs = join(process.cwd(), photo.url.replace(/^\/+/, ''));
      if (existsSync(abs)) {
        await unlink(abs).catch(() => undefined);
      }
    }

    return this.prisma.photo.delete({ where: { id: photoId } });
  }

  // ==== COVER IMAGE ====
  async uploadCover(user: AuthUser, slug: string, url: string) {
    const artist = await this.findBySlug(slug);

    if (!this.canManageArtist(user, artist.id)) {
      throw new UnauthorizedException('No tienes permisos para cambiar la foto de portada.');
    }

    return this.prisma.artist.update({
      where: { id: artist.id },
      data: { coverImage: url },
    });
  }
}
