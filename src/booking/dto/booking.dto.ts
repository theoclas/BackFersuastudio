import { IsString, IsOptional, IsEmail, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @ApiPropertyOptional({ description: 'Slug del artista (opcional)' })
  @IsOptional()
  @IsString()
  artistId?: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+57 300 123 4567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'club', description: 'club | festival | privado | corporativo' })
  @IsString()
  eventType: string;

  @ApiPropertyOptional({ example: '2026-05-20T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiPropertyOptional({ example: 'Medellín' })
  @IsOptional()
  @IsString()
  eventCity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiPropertyOptional({ description: 'Notas internas del admin' })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
