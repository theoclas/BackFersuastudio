import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto, UpdateArtistDto, CreateSpecDto, CreateSocialDto } from './dto/artist.dto';
type AuthUser = {
    role: UserRole;
    artists: {
        id: string;
    }[];
};
export declare class ArtistsService {
    private prisma;
    constructor(prisma: PrismaService);
    private canManageArtist;
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
    findBySlug(slug: string): Promise<{
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
    update(user: AuthUser, slug: string, dto: UpdateArtistDto): Promise<{
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
    remove(user: AuthUser, slug: string): Promise<{
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
    addSpec(user: AuthUser, slug: string, dto: CreateSpecDto): Promise<{
        id: number;
        label: string;
        category: string;
        artistId: string;
    }>;
    removeSpec(user: AuthUser, slug: string, specId: number): Promise<{
        id: number;
        label: string;
        category: string;
        artistId: string;
    }>;
    addSocial(user: AuthUser, slug: string, dto: CreateSocialDto): Promise<{
        id: number;
        platform: string;
        url: string;
        label: string | null;
        artistId: string;
    }>;
    removeSocial(user: AuthUser, slug: string, socialId: number): Promise<{
        id: number;
        platform: string;
        url: string;
        label: string | null;
        artistId: string;
    }>;
    addGenre(user: AuthUser, slug: string, dto: import('./dto/artist.dto').CreateGenreDto): Promise<{
        id: number;
        name: string;
        artistId: string;
    }>;
    removeGenre(user: AuthUser, slug: string, genreId: number): Promise<{
        id: number;
        name: string;
        artistId: string;
    }>;
    addPhoto(user: AuthUser, slug: string, url: string): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        url: string;
        category: string | null;
        order: number;
        artistId: string;
        caption: string | null;
    }>;
    removePhoto(user: AuthUser, slug: string, photoId: number): Promise<{
        id: number;
        isActive: boolean;
        createdAt: Date;
        url: string;
        category: string | null;
        order: number;
        artistId: string;
        caption: string | null;
    }>;
    uploadCover(user: AuthUser, slug: string, url: string): Promise<{
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
export {};
