import { CreateArtistaDto } from './dto/create-artista.dto';
import { UpdateArtistaDto } from './dto/update-artista.dto';
export declare class ArtistasService {
    create(createArtistaDto: CreateArtistaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateArtistaDto: UpdateArtistaDto): string;
    remove(id: number): string;
}
