import type { MulterFileFilterCallback, MulterUploadedFile, Request } from '../types/multer-upload';
export declare const IMAGE_UPLOAD_MAX_BYTES: number;
export declare function imageFileFilter(_req: Request, file: MulterUploadedFile, cb: MulterFileFilterCallback): void;
export declare function galleryDiskStorage(fieldPrefix: string): import("multer").StorageEngine;
