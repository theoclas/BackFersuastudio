import type { Request } from 'express';

/**
 * Forma del archivo que entrega multer en diskStorage (sin depender de global Express.Multer).
 */
export type MulterUploadedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
};

export type MulterFileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

export type { Request };
