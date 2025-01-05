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
exports.FarmService = void 0;
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
const farm_entity_1 = require("../entity/farm-entity");
const farmer_service_1 = require("./farmer-service");
const logger_1 = require("../config/logger");
const data_source_1 = require("../database/data-source");
let FarmService = class FarmService {
    constructor(farmerService) {
        this.farmerService = farmerService;
        this.className = 'FarmService';
        this.farmRepository = data_source_1.AppDataSource.getRepository(farm_entity_1.Farm);
    }
    async create(request, sessionUuid) {
        const isValidArea = this.isValidFarmArea(request);
        if (!isValidArea) {
            throw new routing_controllers_1.BadRequestError(`Sum of [totalCultivableArea] and [totalPreservationArea] must be equals [totalArea]`);
        }
        if (!request.farmerId) {
            throw new routing_controllers_1.BadRequestError(`FarmerId is mandatory`);
        }
        const farmer = await this.farmerService.checkIfExist(request.farmerId);
        if (!farmer) {
            logger_1.logger.info(`${sessionUuid} - ${this.className}:create() Farm id [${request.farmerId}] not found`);
            throw new routing_controllers_1.NotFoundError(`Farmer with id [${request.farmerId}] not found`);
        }
        const entity = Object.assign(new farm_entity_1.Farm(), request);
        entity.farmer = farmer;
        return this.farmRepository.save(entity);
    }
    async findById(farmId, sessionUuid) {
        logger_1.logger.info(`${sessionUuid} - ${this.className}:findById() Farm id [${farmId}]`);
        const farm = await this.farmRepository.findOne({
            where: { id: farmId },
            relations: ['farmer', 'harvests'],
        });
        if (!farm) {
            throw new routing_controllers_1.NotFoundError(`Farm with id: [${farmId}] not found`);
        }
        return farm;
    }
    async find(filter, sessionUuid) {
        let whereFilter = {};
        whereFilter = Object.assign(Object.assign({}, whereFilter), { deleted: false });
        if (filter.id) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { id: filter.id });
        }
        if (filter.name) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { name: filter.name });
        }
        if (filter.city) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { city: filter.city });
        }
        if (filter.state) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { state: filter.state });
        }
        if (filter.farmerId) {
            whereFilter = Object.assign(Object.assign({}, whereFilter), { farmer: { id: filter.farmerId } });
        }
        const skip = (filter.page - 1) * filter.size;
        logger_1.logger.info(`${sessionUuid} - ${this.className}:find() Farm with filter: ${JSON.stringify(whereFilter)}`);
        return this.farmRepository.findAndCount({
            where: whereFilter,
            skip: skip,
            take: filter.size,
            /*relations: ['farmer']*/
        });
    }
    async checkIfExist(farmId) {
        return this.farmRepository.findOne({ where: { id: farmId } });
    }
    async update(farmId, farmInfos, sessionUuid) {
        const farm = await this.farmRepository.findOne({
            where: { id: farmId, deleted: false },
        });
        if (!farm) {
            throw new routing_controllers_1.NotFoundError(`Farm with id: [${farmId}] not found`);
        }
        const isValidArea = this.isValidFarmArea(farmInfos);
        if (!isValidArea) {
            throw new routing_controllers_1.BadRequestError(`Sum of [totalCultivableArea] and [totalPreservationArea] must be equals [totalArea]`);
        }
        await this.farmRepository.update(farmId, farmInfos);
        logger_1.logger.info(`${sessionUuid} - ${this.className}:update() Farm id [${farmId}] updated`);
        return this.farmRepository.findOne({ where: { id: farmId } });
    }
    async delete(farmId, sessionUuid) {
        const farm = await this.farmRepository.findOne({
            where: { id: farmId, deleted: false },
        });
        if (!farm) {
            throw new routing_controllers_1.NotFoundError(`Farm with id: [${farmId}] not found`);
        }
        await this.farmRepository.update(farmId, { deleted: true });
        logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() Farm id [${farmId}] deleted`);
        return this.farmRepository.findOne({ where: { id: farmId } });
    }
    isValidFarmArea(request) {
        if (request.totalArea !==
            request.totalCultivableArea + request.totalPreservationArea) {
            return false;
        }
        return true;
    }
};
FarmService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [farmer_service_1.FarmerService])
], FarmService);
exports.FarmService = FarmService;
//# sourceMappingURL=farm-service.js.map