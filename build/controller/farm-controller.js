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
exports.FarmController = void 0;
const routing_controllers_1 = require("routing-controllers");
const response_model_1 = require("../model/response-model");
const paging_result_model_1 = require("../model/paging-result-model");
const farm_entity_1 = require("../entity/farm-entity");
const farm_service_1 = require("../service/farm-service");
const farm_filter_model_1 = require("../model/farm-filter-model");
const logger_1 = require("../config/logger");
const uuid_1 = require("uuid");
require("./swagger-mapping");
let FarmController = class FarmController {
    constructor(farmService) {
        this.farmService = farmService;
        this.className = 'FarmController';
    }
    /**
     * POST /farm
     * @summary Save a Farm entity
     * @tags Farm
     * @param {FarmCreaterObject} request.body.required - songs info
     * @return {ResponseModelFarmObject} 200 - success response
     */
    async create(req) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:create() START`);
        try {
            const savedFarm = await this.farmService.create(req, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:create() FINISH`);
            return new response_model_1.ResponseModel(201, savedFarm);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:create()Error to save farm [${JSON.stringify(req)}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
    /**
     * GET /farm
     * @summary Get Farm using queryParams
     * @tags Farm
     * @param {string} name.query - nome da fazenda
     * @param {string} city.query - cidade da fazenda
     * @param {string} state.query - estado da fazenda
     * @param {integer} farmerId.query - id do fazendeiro "dono" da fazenda
     * @param {integer} id.query - id da fazenda
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
            const [farm, totalQuantity] = await this.farmService.find(filter, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:read() FINISH`);
            return new paging_result_model_1.PagingResultModel(filter.page, totalQuantity, filter.size, farm);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:read() Error to find farmer with filter: [${JSON.stringify(filter)}] error: [${JSON.stringify(error)}]`);
            throw new routing_controllers_1.InternalServerError(`Something went wrong - Contact the admin`);
        }
    }
    /**
     * GET /farm/{id}
     * @summary Get a Farm entity by ID
     * @tags Farm
     * @param {number} id.path - Identificador da fazenda na base de dados
     * @return {ResponseModelFarmObject} 200 - success response
     */
    async readById(id) {
        const sessionUuid = (0, uuid_1.v4)();
        const farm = await this.farmService.findById(id, sessionUuid);
        return new response_model_1.ResponseModel(200, farm);
    }
    /**
     * PUT /farm/{id}
     * @summary Update a Farm entity
     * @tags Farm
     * @param {number} id.path - Identificador da fazenda na base de dados
     * @return {ResponseModelFarmObject} 200 - success response
     */
    async update(id, farmInfos) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:update() START to FarmId: [${id}]`);
        try {
            const farm = await this.farmService.update(id, farmInfos, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:update() FINISH to FarmId: [${id}]`);
            return new response_model_1.ResponseModel(200, farm);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:update() Error to update farmId: [${id}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
    /**
     * DELETE /farm/{id}
     * @summary Delete a Farm entity
     * @tags Farm
     * @param {number} id.path - Identificador da fazenda na base de dados
     * @return {ResponseModelFarmObject} 200 - success response
     */
    async deleteLogic(id) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() START to FarmerId: [${id}]`);
        try {
            const farm = await this.farmService.delete(id, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() FINISH to FarmId: [${id}]`);
            return new response_model_1.ResponseModel(200, farm);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:delete() Error to deleted farmId: [${id}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
};
__decorate([
    (0, routing_controllers_1.Post)(''),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [farm_entity_1.Farm]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Get)(''),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [farm_filter_model_1.FarmFilterModel]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "read", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "readById", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, farm_entity_1.Farm]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "deleteLogic", null);
FarmController = __decorate([
    (0, routing_controllers_1.JsonController)('/farm'),
    __metadata("design:paramtypes", [farm_service_1.FarmService])
], FarmController);
exports.FarmController = FarmController;
//# sourceMappingURL=farm-controller.js.map