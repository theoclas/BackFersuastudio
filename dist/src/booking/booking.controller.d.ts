import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(dto: CreateBookingDto): Promise<{
        message: string;
        id: string;
    }>;
    findAll(status?: string): Promise<({
        artist: {
            name: string;
            slug: string;
        } | null;
    } & {
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        artistId: string | null;
        message: string | null;
        phone: string | null;
        eventType: string;
        eventDate: Date | null;
        eventCity: string | null;
        adminNotes: string | null;
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
        } | null;
    } & {
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        artistId: string | null;
        message: string | null;
        phone: string | null;
        eventType: string;
        eventDate: Date | null;
        eventCity: string | null;
        adminNotes: string | null;
    }>;
    updateStatus(id: string, dto: UpdateBookingStatusDto): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        artistId: string | null;
        message: string | null;
        phone: string | null;
        eventType: string;
        eventDate: Date | null;
        eventCity: string | null;
        adminNotes: string | null;
    }>;
}
