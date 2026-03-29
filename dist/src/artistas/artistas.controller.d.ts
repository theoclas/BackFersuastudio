import { ArtistasService } from './artistas.service';
import { CreateArtistaDto } from './dto/create-artista.dto';
import { UpdateArtistaDto } from './dto/update-artista.dto';
export declare class ArtistasController {
    private readonly artistasService;
    constructor(artistasService: ArtistasService);
    create(createArtistaDto: CreateArtistaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateArtistaDto: UpdateArtistaDto): string;
    remove(id: string): string;
}
