import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto, CreateSpecDto } from './dto/artist.dto';
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
}
