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
exports.BaseEntity = void 0;
const typeorm_1 = require("typeorm");
class BaseEntity {
}
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    __metadata("design:type", Number)
], BaseEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'date_created',
        nullable: false,
        update: false,
        insert: true,
    }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "dateCreated", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'date_updated',
        nullable: true,
        update: true,
        insert: false,
    }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "dateUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deleted', nullable: false, default: false, type: 'boolean' }),
    __metadata("design:type", Boolean)
], BaseEntity.prototype, "deleted", void 0);
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base-entity.js.map