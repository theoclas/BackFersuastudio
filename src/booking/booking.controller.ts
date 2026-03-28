import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Público — cualquiera puede enviar una solicitud
  @Post()
  @ApiOperation({ summary: 'Enviar solicitud de booking (público)' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  // Admin — solo con token JWT
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar solicitudes de booking (admin)' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'REVIEWED', 'CONFIRMED', 'REJECTED'] })
  findAll(@Query('status') status?: string) {
    return this.bookingService.findAll(status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver detalle de solicitud (admin)' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar estado de solicitud (admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateStatus(id, dto);
  }
}
