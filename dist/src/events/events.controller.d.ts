import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(artist?: string): Promise<({
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
    findUpcoming(artist?: string): Promise<({
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
    create(dto: CreateEventDto, req: any): Promise<{
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
    update(id: string, dto: UpdateEventDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
