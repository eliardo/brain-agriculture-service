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
exports.HarvestService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../database/data-source");
const routing_controllers_1 = require("routing-controllers");
const harvest_entity_1 = require("../entity/harvest-entity");
const farm_service_1 = require("./farm-service");
const logger_1 = require("../config/logger");
let HarvestService = class HarvestService {
    constructor(farmService) {
        this.farmService = farmService;
        this.className = 'HarvestService';
        this.harvestRepository = data_source_1.AppDataSource.getRepository(harvest_entity_1.Harvest);
    }
    async create(request, sessionUuid) {
        if (!request.farmId) {
            throw new routing_controllers_1.BadRequestError(`FarmId is mandatory`);
        }
        const farm = await this.farmService.checkIfExist(request.farmId);
        if (!farm) {
            throw new routing_controllers_1.NotFoundError(`Harvester with id [${request.farmId}] not found`);
        }
        const entity = Object.assign(new harvest_entity_1.Harvest(), request);
        entity.farm = farm;
        logger_1.logger.info(`${sessionUuid} - ${this.className}:create() try save`);
        return this.harvestRepository.save(entity);
    }
    async findById(harvestId, sessionUuid) {
        logger_1.logger.info(`${sessionUuid} - ${this.className}:findById() id: ${harvestId}`);
        const harvest = await this.harvestRepository.findOne({
            where: { id: harvestId },
        });
        if (!harvest) {
            throw new routing_controllers_1.NotFoundError(`Harvest with id: [${harvestId}] not found`);
        }
        return harvest;
    }
    async find(filter, sessionUuid) {
        let whereFilter = {};
        whereFilter = Object.assign(Object.assign({}, whereFilter), { deleted: false });
        if (filter.id) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { id: filter.id });
        }
        if (filter.culture) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { culture: filter.culture });
        }
        if (filter.year) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { year: filter.year });
        }
        if (filter.farmId) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { farm: { id: filter.farmId } });
        }
        logger_1.logger.info(`${sessionUuid} - ${this.className}:find() filter ${JSON.stringify(whereFilter)}`);
        const skip = (filter.page - 1) * filter.size;
        return this.harvestRepository.findAndCount({
            where: whereFilter,
            skip: skip,
            take: filter.size,
        });
    }
    async update(harvestId, harvestInfos, sessionUuid) {
        const harvest = await this.harvestRepository.findOne({
            where: { id: harvestId, deleted: false },
        });
        if (!harvest) {
            throw new routing_controllers_1.NotFoundError(`Harvest with id: [${harvestId}] not found`);
        }
        await this.harvestRepository.update(harvestId, harvestInfos);
        logger_1.logger.info(`${sessionUuid} - ${this.className}:update() harvestId ${harvestId} updated`);
        return this.harvestRepository.findOne({ where: { id: harvestId } });
    }
    async delete(harvestId, sessionUuid) {
        const harvest = await this.harvestRepository.findOne({
            where: { id: harvestId, deleted: false },
        });
        if (!harvest) {
            throw new routing_controllers_1.NotFoundError(`Harvest with id: [${harvestId}] not found`);
        }
        await this.harvestRepository.update(harvestId, { deleted: true });
        logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() harvestId ${harvestId} deleted`);
        return this.harvestRepository.findOne({ where: { id: harvestId } });
    }
};
HarvestService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [farm_service_1.FarmService])
], HarvestService);
exports.HarvestService = HarvestService;
//# sourceMappingURL=harvest-service.js.map