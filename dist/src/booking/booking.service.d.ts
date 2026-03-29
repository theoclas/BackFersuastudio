import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
export declare class BookingService {
    private prisma;
    private mail;
    constructor(prisma: PrismaService, mail: MailService);
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
        phone: string | null;
        eventType: string;
        eventDate: Date | null;
        eventCity: string | null;
        message: string | null;
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
        phone: string | null;
        eventType: string;
        eventDate: Date | null;
        eventCity: string | null;
        message: string | null;
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
        phone: string | null;
        eventType: string;
        eventDate: Date | null;
        eventCity: string | null;
        message: string | null;
        adminNotes: string | null;
    }>;
}
