"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farmer = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base-entity");
const farm_entity_1 = require("./farm-entity");
let Farmer = class Farmer extends base_entity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Farmer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 14 }),
    __metadata("design:type", String)
], Farmer.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'document_type',
        nullable: false,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null ? Number(value) : undefined,
        },
    }),
    __metadata("design:type", Number)
], Farmer.prototype, "documentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'document_type_name',
        nullable: false,
        type: 'varchar',
        length: 10,
    }),
    __metadata("design:type", String)
], Farmer.prototype, "documentTypeName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => farm_entity_1.Farm, farm => farm.farmer, {
        cascade: true,
        lazy: false,
        nullable: true,
    }),
    __metadata("design:type", Array)
], Farmer.prototype, "farms", void 0);
Farmer = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)('ix_deleted_document', ['deleted', 'document'], { unique: true })
], Farmer);
exports.Farmer = Farmer;
//# sourceMappingURL=farmer-entity.js.map