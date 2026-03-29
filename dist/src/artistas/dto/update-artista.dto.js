"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArtistaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_artista_dto_1 = require("./create-artista.dto");
class UpdateArtistaDto extends (0, swagger_1.PartialType)(create_artista_dto_1.CreateArtistaDto) {
}
exports.UpdateArtistaDto = UpdateArtistaDto;
//# sourceMappingURL=update-artista.dto.js.map