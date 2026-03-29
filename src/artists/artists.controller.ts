import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto, CreateSpecDto, CreateSocialDto, CreateGenreDto } from './dto/artist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear artista (admin)' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar artista (admin)' })
  remove(@Param('slug') slug: string) {
    return this.artistsService.remove(slug);
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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/artists',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadPhoto(@Param('slug') slug: string, @UploadedFile() file: any, @Req() req: any) {
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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/artists',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `cover-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadCover(@Param('slug') slug: string, @UploadedFile() file: any, @Req() req: any) {
    return this.artistsService.uploadCover(req.user, slug, `/uploads/artists/${file.filename}`);
  }
}
