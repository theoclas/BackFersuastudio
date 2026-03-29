import { IsString, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({ example: 'macfly-mikebran' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Mac Fly & Mike Bran' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'DJs · Medellín · Electronic' })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty({ example: 'Dúo de DJs originarios de Medellín...' })
  @IsString()
  bio: string;

  @ApiPropertyOptional({ example: 'Medellín, Colombia' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headerImage?: string;

  @ApiPropertyOptional({ example: '573505209860' })
  @IsOptional()
  @IsString()
  whatsapp?: string;
}

export class UpdateArtistDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headerImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateSpecDto {
  @ApiProperty({ example: 'CDJ 3000' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'CDJs' })
  @IsString()
  category: string;
}

export class CreateSocialDto {
  @ApiProperty({ example: 'instagram' })
  @IsString()
  platform: string;

  @ApiProperty({ example: 'https://instagram.com/...' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ example: '@user' })
  @IsOptional()
  @IsString()
  label?: string;
}

export class CreateGenreDto {
  @ApiProperty({ example: 'Tech House' })
  @IsString()
  name: string;
}
