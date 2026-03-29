"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_UPLOAD_MAX_BYTES = void 0;
exports.imageFileFilter = imageFileFilter;
exports.galleryDiskStorage = galleryDiskStorage;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
exports.IMAGE_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;
const imageMime = /^image\/(jpeg|png|webp|gif)$/i;
function imageFileFilter(_req, file, cb) {
    if (!imageMime.test(file.mimetype || '')) {
        cb(new common_1.BadRequestException('Solo se permiten imágenes JPEG, PNG, WebP o GIF.'), false);
        return;
    }
    cb(null, true);
}
function galleryDiskStorage(fieldPrefix) {
    return (0, multer_1.diskStorage)({
        destination: './uploads/artists',
        filename: (_req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${fieldPrefix}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
        },
    });
}
//# sourceMappingURL=multer-image.config.js.map