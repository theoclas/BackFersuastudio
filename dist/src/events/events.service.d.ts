import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
type AuthUser = {
    role: UserRole;
    artists: {
        id: string;
    }[];
};
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    private canManageArtist;
    findAll(artistSlug?: string): Promise<({
        artist: {
            name: string;
            slug: string;
        };
    } & {
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
    })[]>;
    findUpcoming(artistSlug?: string): Promise<({
        artist: {
            name: string;
            slug: string;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        artist: {
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
        };
    } & {
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
    }>;
    create(user: AuthUser, dto: CreateEventDto): Promise<{
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
    }>;
    update(user: AuthUser, id: string, dto: UpdateEventDto): Promise<{
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
    }>;
    remove(user: AuthUser, id: string): Promise<{
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
    }>;
}
export {};
