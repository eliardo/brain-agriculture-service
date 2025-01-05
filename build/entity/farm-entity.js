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
exports.Farm = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base-entity");
const harvest_entity_1 = require("./harvest-entity");
const farmer_entity_1 = require("./farmer-entity");
let Farm = class Farm extends base_entity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Farm.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Farm.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], Farm.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_area',
        nullable: false,
        type: 'decimal',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null ? Number(value) : undefined,
        },
    }),
    __metadata("design:type", Number)
], Farm.prototype, "totalArea", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_preservation_area',
        nullable: false,
        type: 'decimal',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null ? Number(value) : undefined,
        },
    }),
    __metadata("design:type", Number)
], Farm.prototype, "totalPreservationArea", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_cultivable_area',
        nullable: false,
        type: 'decimal',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null ? Number(value) : undefined,
        },
    }),
    __metadata("design:type", Number)
], Farm.prototype, "totalCultivableArea", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => harvest_entity_1.Harvest, harvest => harvest.farm, {
        cascade: true,
        lazy: false,
        eager: false,
        nullable: true,
    }),
    __metadata("design:type", Array)
], Farm.prototype, "harvests", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farmer_entity_1.Farmer, farmer => farmer.farms, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'farmer_id', referencedColumnName: 'id' }),
    __metadata("design:type", farmer_entity_1.Farmer)
], Farm.prototype, "farmer", void 0);
Farm = __decorate([
    (0, typeorm_1.Entity)()
], Farm);
exports.Farm = Farm;
//# sourceMappingURL=farm-entity.js.map