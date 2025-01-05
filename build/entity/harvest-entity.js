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
exports.Harvest = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base-entity");
const farm_entity_1 = require("./farm-entity");
let Harvest = class Harvest extends base_entity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 40 }),
    __metadata("design:type", String)
], Harvest.prototype, "culture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Harvest.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Harvest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farm_entity_1.Farm, farm => farm.harvests),
    (0, typeorm_1.JoinColumn)({ name: 'farm_id', referencedColumnName: 'id' }),
    __metadata("design:type", farm_entity_1.Farm)
], Harvest.prototype, "farm", void 0);
Harvest = __decorate([
    (0, typeorm_1.Entity)()
], Harvest);
exports.Harvest = Harvest;
//# sourceMappingURL=harvest-entity.js.map