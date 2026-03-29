import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto, CreateSpecDto, CreateSocialDto, CreateGenreDto } from './dto/artist.dto';
import type { MulterUploadedFile } from '../types/multer-upload';
export declare class ArtistsController {
    private readonly artistsService;
    constructor(artistsService: ArtistsService);
    findAll(): Promise<({
        genres: {
            id: number;
            name: string;
            artistId: string;
        }[];
        socials: {
            id: number;
            platform: string;
            url: string;
            label: string | null;
            artistId: string;
        }[];
        events: {
            id: string;
            createdAt: Date;
            city: string;
            updatedAt: Date;
            title: string;
            status: import("@prisma/client").$Enums.EventStatus;
            date: Date;
            artistId: string;
            venue: string;
            ticketUrl: string | null;
            notes: string | null;
        }[];
        photos: {
            id: number;
            isActive: boolean;
            createdAt: Date;
            url: string;
            category: string | null;
            order: number;
            artistId: string;
            caption: string | null;
        }[];
        specs: {
            id: number;
            label: string;
            category: string;
            artistId: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        slug: string;
        tagline: string | null;
        bio: string;
        city: string | null;
        coverImage: string | null;
        headerImage: string | null;
        whatsapp: string | null;
        updatedAt: Date;
    })[]>;
    findOne(slug: string): Promise<{
        genres: {
            id: number;
            name: string;
            artistId: string;
        }[];
        socials: {
            id: number;
            platform: string;
            url: string;
            label: string | null;
            artistId: string;
        }[];
        events: {
            id: string;
            createdAt: Date;
            city: string;
            updatedAt: Date;
            title: string;
            status: import("@prisma/client").$Enums.EventStatus;
            date: Date;
            artistId: string;
            venue: string;
            ticketUrl: string | null;
            notes: string | null;
        }[];
        photos: {
            id: number;
            isActive: boolean;
            createdAt: Date;
            url: string;
            category: string | null;
            order: number;
            artistId: string;
            caption: string | null;
        }[];
        specs: {
            id: number;
            label: string;
            category: string;
            artistId: string;
        }[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        slug: string;
        tagline: string | null;
        bio: string;
        city: string | null;
        coverImage: string | null;
        headerImage: string | null;
        whatsapp: string | null;
        updatedAt: Date;
    }>;
    create(dto: CreateArtistDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        slug: string;
        tagline: string | null;
        bio: string;
        city: string | null;
        coverImage: string | null;
        headerImage: string | null;
        whatsapp: string | null;
        updatedAt: Date;
    }>;
    update(slug: string, dto: UpdateArtistDto, req: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        slug: string;
        tagline: string | null;
        bio: string;
        city: string | null;
        coverImage: string | null;
        headerImage: string | null;
        whatsapp: string | null;
        updatedAt: Date;
    }>;
    remove(req: any, slug: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        slug: string;
        tagline: string | null;
        bio: string;
        city: string | null;
        coverImage: string | null;
        headerImage: string | null;
        whatsapp: string | null;
        updatedAt: Date;
    }>;
    addSpec(slug: string, dto: CreateSpecDto, req: any): Promise<{
        id: number;
        label: string;
        category: string;
        artistId: string;
    }>;
    removeSpec(slug: string, specId: number, req: any): Promise<{
        id: number;
        label: string;
        category: string;
        artistId: string;
    }>;
    addSocial(slug: string, dto: CreateSocialDto, req: any): Promise<{
        id: number;
        platform: string;
        url: string;
        label: string | null;
        artistId: string;
    }>;
    removeSocial(slug: string, socialId: number, req: any): Promise<{
        id: number;
        platform: string;
        url: string;
        label: string | null;
        artistId: string;
    }>;
    addGenre(slug: string, dto: CreateGenreDto, req: any): Promise<{
        id: number;
        name: string;
        artistId: string;
    }>;
    removeGenre(slug: string, genreId: number, req: any): Promise<{
        id: number;
        name: string;
        artistId: string;
    }>;
    uploadPhoto(slug: string, file: MulterUploadedFile | undefined, req: any): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        url: string;
        category: string | null;
        order: number;
        artistId: string;
        caption: string | null;
    }>;
    removePhoto(slug: string, photoId: number, req: any): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        url: string;
        category: string | null;
        order: number;
        artistId: string;
        caption: string | null;
    }>;
    uploadCover(slug: string, file: MulterUploadedFile | undefined, req: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        slug: string;
        tagline: string | null;
        bio: string;
        city: string | null;
        coverImage: string | null;
        headerImage: string | null;
        whatsapp: string | null;
        updatedAt: Date;
    }>;
}
