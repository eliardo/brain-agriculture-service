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
exports.FarmerService = void 0;
const farmer_entity_1 = require("../entity/farmer-entity");
const typedi_1 = require("typedi");
const data_source_1 = require("../database/data-source");
const routing_controllers_1 = require("routing-controllers");
const document_type_enum_1 = require("../entity/enum/document-type-enum");
const logger_1 = require("../config/logger");
let FarmerService = class FarmerService {
    constructor() {
        this.className = 'FarmerService';
        this.farmerRepository = data_source_1.AppDataSource.getRepository(farmer_entity_1.Farmer);
    }
    async create(request, sessionUuid) {
        if (!request.name) {
            throw new routing_controllers_1.BadRequestError(`Fild [name] is mandatory`);
        }
        if (!request.document) {
            throw new routing_controllers_1.BadRequestError(`Fild [document] is mandatory`);
        }
        request.document = request.document.replace(/\D/g, '');
        const farmerExist = await this.checkIfDocumentExist(request.document);
        if (farmerExist) {
            throw new routing_controllers_1.BadRequestError(`Already exist a farmer with this document: [${request.document}]`);
        }
        if (!this.isValidFullName(request.name)) {
            throw new routing_controllers_1.BadRequestError(`Invalid farmer name: [${request.name}] - Must be a fullname`);
        }
        const farmer = Object.assign(new farmer_entity_1.Farmer(), request);
        const enumDocumentType = await this.validateAndGetDocumentType(request);
        if (enumDocumentType === document_type_enum_1.DocumentTypeEnum.CPF ||
            enumDocumentType === document_type_enum_1.DocumentTypeEnum.CNPJ) {
            farmer.documentType = enumDocumentType;
            farmer.documentTypeName =
                document_type_enum_1.DocumentTypeEnum[(0, document_type_enum_1.toDocumentTypeEnum)(enumDocumentType)];
        }
        else {
            throw new routing_controllers_1.BadRequestError(`Invalid document: [${farmer.document}] must be a CPF or CNPJ valid`);
        }
        logger_1.logger.info(`${sessionUuid} - ${this.className}:create() Try create farmer`);
        return this.farmerRepository.save(farmer);
    }
    async findById(farmerId, sessionUuid) {
        logger_1.logger.info(`${sessionUuid} - ${this.className}:findById() farmerId ${farmerId}`);
        const farmer = await this.farmerRepository.findOne({
            where: { id: farmerId },
            relations: ['farms'],
        });
        if (!farmer) {
            throw new routing_controllers_1.NotFoundError(`Farmer with id: [${farmerId}] not found`);
        }
        return farmer;
    }
    async checkIfExist(farmerId) {
        return this.farmerRepository.findOne({ where: { id: farmerId } });
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
        if (filter.document) {
            const cleanDocument = filter.document.replace(/\D/g, '');
            whereFilter = Object.assign(Object.assign({}, whereFilter), { document: cleanDocument });
        }
        logger_1.logger.info(`${sessionUuid} - ${this.className}:find() filter ${JSON.stringify(whereFilter)}`);
        const skip = (filter.page - 1) * filter.size;
        return this.farmerRepository.findAndCount({
            where: whereFilter,
            skip: skip,
            take: filter.size,
        });
    }
    async update(farmerId, farmerInfos, sessionUuid) {
        const farmer = await this.farmerRepository.findOne({
            where: { id: farmerId, deleted: false },
        });
        if (!farmer) {
            throw new routing_controllers_1.NotFoundError(`Farmer with id: [${farmerId}] not found`);
        }
        if (farmerInfos.document) {
            farmerInfos.document = farmerInfos.document.replace(/\D/g, '');
        }
        if (farmerInfos.name && !this.isValidFullName(farmerInfos.name)) {
            throw new routing_controllers_1.BadRequestError(`Invalid farmer name: [${farmerInfos.name}] - Must be a fullname`);
        }
        const enumDocumentType = await this.validateAndGetDocumentType(farmerInfos);
        const entityToUpdate = Object.assign(new farmer_entity_1.Farmer(), farmerInfos);
        if (enumDocumentType === document_type_enum_1.DocumentTypeEnum.CPF ||
            enumDocumentType === document_type_enum_1.DocumentTypeEnum.CNPJ) {
            entityToUpdate.documentType = enumDocumentType;
            entityToUpdate.documentTypeName =
                document_type_enum_1.DocumentTypeEnum[(0, document_type_enum_1.toDocumentTypeEnum)(enumDocumentType)];
        }
        else {
            throw new routing_controllers_1.BadRequestError(`Invalid document: [${farmerInfos.document}] must be a CPF or CNPJ valid`);
        }
        await this.farmerRepository.update(farmerId, entityToUpdate);
        logger_1.logger.info(`${sessionUuid} - ${this.className}:update() farmer ${farmerId} updated`);
        return this.farmerRepository.findOne({ where: { id: farmerId } });
    }
    async delete(farmerId, sessionUuid) {
        const farmer = await this.farmerRepository.findOne({
            where: { id: farmerId, deleted: false },
        });
        if (!farmer) {
            throw new routing_controllers_1.NotFoundError(`Farmer with id: [${farmerId}] not found`);
        }
        await this.farmerRepository.update(farmerId, { deleted: true });
        logger_1.logger.info(`${sessionUuid} - ${this.className}:delete() farmer ${farmerId} deleted`);
        return this.farmerRepository.findOne({ where: { id: farmerId } });
    }
    isValidFullName(name) {
        const regex = /^[a-zA-Zà-úÀ-Ú]{2,}(?: [a-zA-Zà-úÀ-Ú]{2,})+$/;
        return regex.test(name);
    }
    async validateAndGetDocumentType(entity) {
        if (entity.document.length === 11) {
            return document_type_enum_1.DocumentTypeEnum.CPF;
        }
        else if (entity.document.length === 14) {
            return document_type_enum_1.DocumentTypeEnum.CNPJ;
        }
        else {
            return null;
        }
    }
    async checkIfDocumentExist(document) {
        const farmer = await this.farmerRepository.findOne({
            where: { document: document, deleted: false },
        });
        if (farmer) {
            return true;
        }
        return false;
    }
};
FarmerService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], FarmerService);
exports.FarmerService = FarmerService;
//# sourceMappingURL=farmer-service.js.map