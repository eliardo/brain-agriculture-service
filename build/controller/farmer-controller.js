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
exports.FarmerController = void 0;
const routing_controllers_1 = require("routing-controllers");
const farmer_service_1 = require("../service/farmer-service");
const farmer_entity_1 = require("../entity/farmer-entity");
const response_model_1 = require("../model/response-model");
const farmer_filter_model_1 = require("../model/farmer-filter-model");
const paging_result_model_1 = require("../model/paging-result-model");
const logger_1 = require("../config/logger");
const uuid_1 = require("uuid");
require("./swagger-mapping");
const typedi_1 = require("typedi");
let FarmerController = class FarmerController {
    constructor(farmerService) {
        this.farmerService = farmerService;
        this.className = 'FarmerController';
    }
    /**
     * POST /farmer
     * @summary Save a Farmer entity
     * @tags Farmer
     * @param {FarmerCreaterObject} request.body.required - farmer infos
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    async create(req) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:create() START`);
        try {
            const savedFarmer = await this.farmerService.create(req, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:create() FINISH`);
            return new response_model_1.ResponseModel(201, savedFarmer);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:create() Error to save farmer with document: [${req.document}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
    /**
     * GET /farmer
     * @summary Get Farmer using queryParams
     * @tags Farmer
     * @param {string} document.query - documento do fazendeiro
     * @param {string} name.query - nome do fazendeiro
     * @param {integer} id.query - id do fazendeiro
     * @param {integer} page.query - paginação
     * @param {integer} size.query - quantidade de itens por request (default 20))
     * @return {ResponseModelPaginationFarmerObject} 200 - success response
     */
    async read(filter) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:read() START`);
        try {
            filter.page = filter.page && filter.page > 0 ? filter.page : 1;
            filter.size = filter.size && filter.size > 0 ? filter.size : 20;
            const [farmers, totalQuantity] = await this.farmerService.find(filter, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:read() FINISH`);
            return new paging_result_model_1.PagingResultModel(filter.page, totalQuantity, filter.size, farmers);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:read() Error to find farmer with filter: [${JSON.stringify(filter)}] - error: ${JSON.stringify(error)}`);
            throw new routing_controllers_1.InternalServerError(`Something went wrong - Contact the admin`);
        }
    }
    /**
     * GET /farmer/{id}
     * @summary Get by Id a Farmer entity
     * @tags Farmer
     * @param {number} id.path - Identificador do fazendeiro na base de dados
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    async readById(id) {
        const sessionUuid = (0, uuid_1.v4)();
        const farmer = await this.farmerService.findById(id, sessionUuid);
        return new response_model_1.ResponseModel(200, farmer);
    }
    /**
     * PUT /farmer/{id}
     * @summary Update a Farmer entity
     * @tags Farmer
     * @param {number} id.path - Identificador do fazendeiro na base de dados
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    async update(id, farmerInfos) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:update() START to FarmerId: [${id}]`);
        try {
            const farmer = await this.farmerService.update(id, farmerInfos, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:update() FINISH to FarmerId: [${id}]`);
            return new response_model_1.ResponseModel(200, farmer);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:update() Error to update farmerId: [${id}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
    /**
     * DELETE /farmer/{id}
     * @summary Delete a Farmer entity
     * @tags Farmer
     * @param {number} id.path - Identificador do fazendeiro na base de dados
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    async deleteLogic(id) {
        const sessionUuid = (0, uuid_1.v4)();
        logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() START to FarmerId: [${id}]`);
        try {
            const farmer = await this.farmerService.delete(id, sessionUuid);
            logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() FINISH to FarmerId: [${id}]`);
            return new response_model_1.ResponseModel(200, farmer);
        }
        catch (error) {
            logger_1.logger.error(`${sessionUuid} - ${this.className}:delete() Error to deleted farmerId: [${id}]`);
            return new response_model_1.ResponseModel(error.code || error.httpCode, error.message);
        }
    }
};
__decorate([
    (0, routing_controllers_1.Post)(''),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [farmer_entity_1.Farmer]),
    __metadata("design:returntype", Promise)
], FarmerController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Get)(''),
    __param(0, (0, routing_controllers_1.QueryParams)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [farmer_filter_model_1.FarmerFilterModel]),
    __metadata("design:returntype", Promise)
], FarmerController.prototype, "read", null);
__decorate([
    (0, routing_controllers_1.Get)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FarmerController.prototype, "readById", null);
__decorate([
    (0, routing_controllers_1.Put)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, farmer_entity_1.Farmer]),
    __metadata("design:returntype", Promise)
], FarmerController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)('/:id'),
    __param(0, (0, routing_controllers_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FarmerController.prototype, "deleteLogic", null);
FarmerController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)('/farmer'),
    __metadata("design:paramtypes", [farmer_service_1.FarmerService])
], FarmerController);
exports.FarmerController = FarmerController;
//# sourceMappingURL=farmer-controller.js.map