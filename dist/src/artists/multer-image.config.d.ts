export declare const IMAGE_UPLOAD_MAX_BYTES: number;
export declare function imageFileFilter(_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void): void;
export declare function galleryDiskStorage(fieldPrefix: string): import("multer").StorageEngine;
