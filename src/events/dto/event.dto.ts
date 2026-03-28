import { IsString, IsOptional, IsDateString, IsEnum, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ example: 'artista-slug-aqui' })
  @IsString()
  artistId: string;

  @ApiProperty({ example: 'Closing Night @ Club X' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Club Vertigo' })
  @IsString()
  venue: string;

  @ApiProperty({ example: 'Medellín' })
  @IsString()
  city: string;

  @ApiProperty({ example: '2026-04-15T22:00:00Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  ticketUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEventDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ticketUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: EventStatus })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
