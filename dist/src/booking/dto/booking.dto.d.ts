import { BookingStatus } from '@prisma/client';
export declare class CreateBookingDto {
    artistId?: string;
    name: string;
    email: string;
    phone?: string;
    eventType: string;
    eventDate?: string;
    eventCity?: string;
    message?: string;
}
export declare class UpdateBookingStatusDto {
    status: BookingStatus;
    adminNotes?: string;
}
