import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los eventos' })
  @ApiQuery({ name: 'artist', required: false, description: 'Slug del artista' })
  findAll(@Query('artist') artist?: string) {
    return this.eventsService.findAll(artist);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Listar próximos eventos' })
  @ApiQuery({ name: 'artist', required: false })
  findUpcoming(@Query('artist') artist?: string) {
    return this.eventsService.findUpcoming(artist);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento por ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear evento (admin)' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar evento (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar evento (admin)' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
