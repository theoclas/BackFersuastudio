import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { galleryDiskStorage, imageFileFilter, IMAGE_UPLOAD_MAX_BYTES } from './multer-image.config';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto, CreateSpecDto, CreateSocialDto, CreateGenreDto } from './dto/artist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import type { MulterUploadedFile } from '../types/multer-upload';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los artistas activos (público)' })
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obtener artista por slug (público)' })
  findOne(@Param('slug') slug: string) {
    return this.artistsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear artista (solo administrador)' })
  create(@Body() dto: CreateArtistDto) {
    return this.artistsService.create(dto);
  }

  @Patch(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar artista (admin)' })
  update(@Param('slug') slug: string, @Body() dto: UpdateArtistDto, @Req() req: any) {
    return this.artistsService.update(req.user, slug, dto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar artista (solo administrador)' })
  remove(@Req() req: any, @Param('slug') slug: string) {
    return this.artistsService.remove(req.user, slug);
  }

  // ==== SPECS ====
  @Post(':slug/specs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar Spec/Equipo al Rider del Artista' })
  addSpec(@Param('slug') slug: string, @Body() dto: CreateSpecDto, @Req() req: any) {
    return this.artistsService.addSpec(req.user, slug, dto);
  }

  @Delete(':slug/specs/:specId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar Spec/Equipo del Rider' })
  removeSpec(@Param('slug') slug: string, @Param('specId', ParseIntPipe) specId: number, @Req() req: any) {
    return this.artistsService.removeSpec(req.user, slug, specId);
  }

  // ==== SOCIALS ====
  @Post(':slug/socials')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar Red Social al Artista' })
  addSocial(@Param('slug') slug: string, @Body() dto: CreateSocialDto, @Req() req: any) {
    return this.artistsService.addSocial(req.user, slug, dto);
  }

  @Delete(':slug/socials/:socialId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar Red Social' })
  removeSocial(@Param('slug') slug: string, @Param('socialId', ParseIntPipe) socialId: number, @Req() req: any) {
    return this.artistsService.removeSocial(req.user, slug, socialId);
  }

  // ==== GENRES ====
  @Post(':slug/genres')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar Género Musical al Artista' })
  addGenre(@Param('slug') slug: string, @Body() dto: CreateGenreDto, @Req() req: any) {
    return this.artistsService.addGenre(req.user, slug, dto);
  }

  @Delete(':slug/genres/:genreId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar Género Musical' })
  removeGenre(@Param('slug') slug: string, @Param('genreId', ParseIntPipe) genreId: number, @Req() req: any) {
    return this.artistsService.removeGenre(req.user, slug, genreId);
  }

  // ==== PHOTOS / GALLERY ====
  @Post(':slug/photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Subir una foto a la galería del artista' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: IMAGE_UPLOAD_MAX_BYTES },
      fileFilter: imageFileFilter,
      storage: galleryDiskStorage('file'),
    }),
  )
  async uploadPhoto(@Param('slug') slug: string, @UploadedFile() file: MulterUploadedFile | undefined, @Req() req: any) {
    if (!file) throw new BadRequestException('Archivo de imagen requerido.');
    return this.artistsService.addPhoto(req.user, slug, `/uploads/artists/${file.filename}`);
  }

  @Delete(':slug/photos/:photoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una foto de la galería' })
  removePhoto(@Param('slug') slug: string, @Param('photoId', ParseIntPipe) photoId: number, @Req() req: any) {
    return this.artistsService.removePhoto(req.user, slug, photoId);
  }

  // ==== COVER IMAGE ====
  @Post(':slug/cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Subir la foto de portada principal del artista' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: IMAGE_UPLOAD_MAX_BYTES },
      fileFilter: imageFileFilter,
      storage: galleryDiskStorage('cover'),
    }),
  )
  async uploadCover(@Param('slug') slug: string, @UploadedFile() file: MulterUploadedFile | undefined, @Req() req: any) {
    if (!file) throw new BadRequestException('Archivo de imagen requerido.');
    return this.artistsService.uploadCover(req.user, slug, `/uploads/artists/${file.filename}`);
  }
}
