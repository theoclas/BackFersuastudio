import { PartialType } from '@nestjs/swagger';
import { CreateArtistaDto } from './create-artista.dto';

export class UpdateArtistaDto extends PartialType(CreateArtistaDto) {}
