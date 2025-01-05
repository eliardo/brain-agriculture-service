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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestController = void 0;
const routing_controllers_1 = require("routing-controllers");
const response_model_1 = require("../model/response-model");
const paging_result_model_1 = require("../model/paging-result-model");
const harvest_entity_1 = require("../entity/harvest-entity");
const harvest_service_1 = require("../service/harvest-service");
const harvest_filter_model_1 = require("../model/harvest-filter-model");
const logger_1 = require("../config/logger");
const uuid_1 = require("uuid");
let HarvestController = class HarvestController {
    constructor(harvestService) {
        this.harvestService = harvestService;
        this.className = 'HarvestController';
    }
    /**
     * POST /harvest
     * @summary Save a Harvest entity
     * @tags Harvest
     * @param {FarmerCreaterObject} request.body.required - farmer infos
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    async create(req) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:create() START`);
        try {
            const savedHarvest = await this.harvestService.create(req, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:create() FINISH`);
            return new response_model_1.ResponseModel(201, savedHarvest);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:create()Error to save harvest [${JSON.stringify(req)}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
    /**
     * GET /harvest
     * @summary Get Farm using queryParams
     * @tags Harvest
     * @param {string} culture.query - cultura plantada na fazenda para a safra
     * @param {integer} year.query - ano da safra
     * @param {integer} farmId.query - id da fazenda onde a safra foi realizada
     * @param {integer} id.query - id da safra
     * @param {integer} page.query - paginação
     * @param {integer} size.query - quantidade de itens por request (default 20))
     * @return {ResponseModelPaginationFarmObject} 200 - success response
     */
    async read(filter) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:read() START`);
        try {
            filter.page = filter.page && filter.page > 0 ? filter.page : 1;
            filter.size = filter.size && filter.size > 0 ? filter.size : 20;
            const [harvest, totalQuantity] = await this.harvestService.find(filter, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:read() FINISH`);
            return new paging_result_model_1.PagingResultModel(filter.page, totalQuantity, filter.size, harvest);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:read() Error to find harvester with filter: [${JSON.stringify(filter)}] error: [${JSON.stringify(error)}]`);
            throw new routing_controllers_1.InternalServerError(`Something went wrong - Contact the admin`);
        }
    }
    /**
     * GET /harvest/{id}
     * @summary Get a Harvest entity by id
     * @tags Harvest
     * @param {number} id.path - Identificador da safra na base de dados
     * @return {ResponseModelHarvestObject} 200 - success response
     */
    async readById(id) {
        const sessionUuid = (0, uuid_1.v4)();
        const harvest = await this.harvestService.findById(id, sessionUuid);
        return new response_model_1.ResponseModel(200, harvest);
    }
    /**
     * PUT /harvest/{id}
     * @summary Update a Harvest entity
     * @tags Harvest
     * @param {number} id.path - Identificador da safra na base de dados
     * @return {ResponseModelHarvestObject} 200 - success response
     */
    async update(id, harvestInfos) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:update() START to HarvestId: [${id}]`);
        try {
            const harvest = await this.harvestService.update(id, harvestInfos, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:update() FINISH to HarvestId: [${id}]`);
            return new response_model_1.ResponseModel(200, harvest);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:update() Error to update harvestId: [${id}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
    /**
     * DELETE /harvest/{id}
     * @summary Delete a Harvest entity
     * @tags Harvest
     * @param {number} id.path - Identificador da safra na base de dados
     * @return {ResponseModelHarvestObject} 200 - success response
     */
    async deleteLogic(id) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() START to HarvesterId: [${id}]`);
        try {
            const harvest = await this.harvestService.delete(id, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() FINISH to HarvestId: [${id}]`);
            return new response_model_1.ResponseModel(200, harvest);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:delete() Error to deleted harvestId: [${id}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
};
__decorate([
    (0, routing_controllers_1.Post)(''),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [harvest_filter_model_1.HarvestFilterModel]),
    __metadata("design:returntype", Promise)
], HarvestController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Get)(''),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [harvest_filter_model_1.HarvestFilterModel]),
    __metadata("design:returntype", Promise)
], HarvestController.prototype, "read", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HarvestController.prototype, "readById", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, harvest_entity_1.Harvest]),
    __metadata("design:returntype", Promise)
], HarvestController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], HarvestController.prototype, "deleteLogic", null);
HarvestController = __decorate([
    (0, routing_controllers_1.JsonController)('/harvest'),
    __metadata("design:paramtypes", [harvest_service_1.HarvestService])
], HarvestController);
exports.HarvestController = HarvestController;
//# sourceMappingURL=harvest-controller.js.map