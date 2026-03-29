import { EventStatus } from '@prisma/client';
export declare class CreateEventDto {
    artistId: string;
    title: string;
    venue: string;
    city: string;
    date: string;
    ticketUrl?: string;
    notes?: string;
}
export declare class UpdateEventDto {
    title?: string;
    venue?: string;
    city?: string;
    date?: string;
    ticketUrl?: string;
    notes?: string;
    status?: EventStatus;
}
