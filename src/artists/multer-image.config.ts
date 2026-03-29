import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const IMAGE_UPLOAD_MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const imageMime = /^image\/(jpeg|png|webp|gif)$/i;

export function imageFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void {
  if (!imageMime.test(file.mimetype || '')) {
    cb(new BadRequestException('Solo se permiten imágenes JPEG, PNG, WebP o GIF.') as Error, false);
    return;
  }
  cb(null, true);
}

export function galleryDiskStorage(fieldPrefix: string) {
  return diskStorage({
    destination: './uploads/artists',
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${fieldPrefix}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  });
}
