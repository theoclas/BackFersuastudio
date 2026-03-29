import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private transporter;
    constructor(config: ConfigService);
    sendBookingNotification(booking: {
        name: string;
        email: string;
        phone?: string;
        eventType: string;
        eventDate?: Date;
        eventCity?: string;
        message?: string;
        artistName?: string;
    }): Promise<void>;
}
