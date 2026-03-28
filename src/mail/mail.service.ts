import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: config.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    });
  }

  async sendBookingNotification(booking: {
    name: string;
    email: string;
    phone?: string;
    eventType: string;
    eventDate?: Date;
    eventCity?: string;
    message?: string;
    artistName?: string;
  }) {
    const subject = `📩 Nueva solicitud de booking — ${booking.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a0a2e, #0f0f1a); padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 20px;">🎛️ FersuaStudio — Nueva Solicitud de Booking</h1>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Artista:</td><td style="padding: 8px 0; font-weight: bold;">${booking.artistName || 'No especificado'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Nombre:</td><td style="padding: 8px 0;">${booking.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Teléfono:</td><td style="padding: 8px 0;">${booking.phone || '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Tipo de evento:</td><td style="padding: 8px 0;">${booking.eventType}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Fecha:</td><td style="padding: 8px 0;">${booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('es-CO') : '—'}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Ciudad:</td><td style="padding: 8px 0;">${booking.eventCity || '—'}</td></tr>
          </table>
          ${booking.message ? `
          <div style="margin-top: 16px; padding: 14px; background: #fff; border-left: 4px solid #6a11cb; border-radius: 4px;">
            <strong>Mensaje:</strong><br>${booking.message}
          </div>` : ''}
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            FersuaStudio Booking System
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: this.config.get('MAIL_USER'),
      subject,
      html,
    });

    // Confirmación al cliente
    await this.transporter.sendMail({
      from: this.config.get('MAIL_FROM'),
      to: booking.email,
      subject: '✅ Recibimos tu solicitud de booking — FersuaStudio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px; border-radius: 12px;">
          <h2 style="color: #1a0a2e;">¡Hola, ${booking.name}! 👋</h2>
          <p>Recibimos tu solicitud de booking${booking.artistName ? ` para <strong>${booking.artistName}</strong>` : ''}.</p>
          <p>Nos pondremos en contacto contigo a la brevedad para darte más información sobre disponibilidad y caché.</p>
          <p style="color: #666; font-size: 14px;">Si tienes urgencia, puedes escribirnos directamente por WhatsApp.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">FersuaStudio Booking</p>
        </div>
      `,
    });
  }
}
