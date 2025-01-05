import { Repository } from 'typeorm';
import { Farmer } from '../entity/farmer-entity';
import { Service } from 'typedi';
import { AppDataSource } from '../database/data-source';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import {
    DocumentTypeEnum,
    toDocumentTypeEnum,
} from '../entity/enum/document-type-enum';
import { FarmerFilterModel } from '../model/farmer-filter-model';
import { logger } from '../config/logger';

@Service()
export class FarmerService {
    private className = 'FarmerService';

    private readonly farmerRepository: Repository<Farmer>;
    constructor() {
        this.farmerRepository = AppDataSource.getRepository(Farmer);
    }
    async create(request: Farmer, sessionUuid: string): Promise<Farmer> {
        if (!request.name) {
            throw new BadRequestError(`Fild [name] is mandatory`);
        }

        if (!request.document) {
            throw new BadRequestError(`Fild [document] is mandatory`);
        }

        request.document = request.document.replace(/\D/g, '');

        const farmerExist = await this.checkIfDocumentExist(request.document);
        if (farmerExist) {
            throw new BadRequestError(
                `Already exist a farmer with this document: [${request.document}]`,
            );
        }

        if (!this.isValidFullName(request.name)) {
            throw new BadRequestError(
                `Invalid farmer name: [${request.name}] - Must be a fullname`,
            );
        }

        const farmer = Object.assign(new Farmer(), request);
        const enumDocumentType = await this.validateAndGetDocumentType(request);

        if (
            enumDocumentType === DocumentTypeEnum.CPF ||
            enumDocumentType === DocumentTypeEnum.CNPJ
        ) {
            farmer.documentType = enumDocumentType;
            farmer.documentTypeName =
                DocumentTypeEnum[toDocumentTypeEnum(enumDocumentType)];
        } else {
            throw new BadRequestError(
                `Invalid document: [${farmer.document}] must be a CPF or CNPJ valid`,
            );
        }

        logger.info(
            `${sessionUuid} - ${this.className}:create() Try create farmer`,
        );
        return this.farmerRepository.save(farmer);
    }

    async findById(farmerId: number, sessionUuid: string): Promise<Farmer> {
        logger.info(
            `${sessionUuid} - ${this.className}:findById() farmerId ${farmerId}`,
        );
        const farmer = await this.farmerRepository.findOne({
            where: { id: farmerId },
            relations: ['farms'],
        });
        if (!farmer) {
            throw new NotFoundError(`Farmer with id: [${farmerId}] not found`);
        }
        return farmer;
    }

    async checkIfExist(farmerId: number): Promise<Farmer> {
        try {
            return this.farmerRepository.findOne({ where: { id: Number(farmerId) } });
        } catch (error) {
            throw new NotFoundError(`Farmer with id: [${farmerId}] not found`);
        }
    }

    async find(
        filter: FarmerFilterModel,
        sessionUuid: string,
    ): Promise<[Farmer[], number]> {
        let whereFilter: any = {};

        whereFilter = { ...whereFilter, deleted: false };

        if (filter.id) {
            whereFilter = { ...whereFilter, id: filter.id };
        }

        if (filter.name) {
            whereFilter = { ...whereFilter, name: filter.name };
        }

        if (filter.document) {
            const cleanDocument = filter.document.replace(/\D/g, '');
            whereFilter = { ...whereFilter, document: cleanDocument };
        }

        logger.info(
            `${sessionUuid} - ${this.className}:find() filter ${JSON.stringify(
                whereFilter,
            )}`,
        );

        const skip = (filter.page - 1) * filter.size;
        return this.farmerRepository.findAndCount({
            where: whereFilter,
            skip: skip,
            take: filter.size,
        });
    }

    async update(
        farmerId: number,
        farmerInfos: Farmer,
        sessionUuid: string,
    ): Promise<Farmer> {
        const farmer = await this.farmerRepository.findOne({
            where: { id: farmerId, deleted: false },
        });
        if (!farmer) {
            throw new NotFoundError(`Farmer with id: [${farmerId}] not found`);
        }

        const entityToUpdate = Object.assign(new Farmer(), farmerInfos);

        if (farmerInfos.document) {
            farmerInfos.document = farmerInfos.document.replace(/\D/g, '');
            const enumDocumentType = await this.validateAndGetDocumentType(
                farmerInfos,
            );

            if (
                enumDocumentType === DocumentTypeEnum.CPF ||
                enumDocumentType === DocumentTypeEnum.CNPJ
            ) {
                entityToUpdate.documentType = enumDocumentType;
                entityToUpdate.documentTypeName =
                    DocumentTypeEnum[toDocumentTypeEnum(enumDocumentType)];
            } else {
                throw new BadRequestError(
                    `Invalid document: [${farmerInfos.document}] must be a CPF or CNPJ valid`,
                );
            }
        }

        if (farmerInfos.name && !this.isValidFullName(farmerInfos.name)) {
            throw new BadRequestError(
                `Invalid farmer name: [${farmerInfos.name}] - Must be a fullname`,
            );
        }

        await this.farmerRepository.update(farmerId, entityToUpdate);

        logger.info(
            `${sessionUuid} - ${this.className}:update() farmer ${farmerId} updated`,
        );
        return this.farmerRepository.findOne({ where: { id: farmerId } });
    }

    async delete(farmerId: number, sessionUuid: string): Promise<Farmer> {
        const farmer = await this.farmerRepository.findOne({
            where: { id: farmerId, deleted: false },
        });
        if (!farmer) {
            throw new NotFoundError(`Farmer with id: [${farmerId}] not found`);
        }
        await this.farmerRepository.update(farmerId, { deleted: true });

        logger.info(
            `${sessionUuid} - ${this.className}:delete() farmer ${farmerId} deleted`,
        );
        return this.farmerRepository.findOne({ where: { id: farmerId } });
    }

    isValidFullName(name: string): boolean {
        const regex = /^[a-zA-Zà-úÀ-Ú]{2,}(?: [a-zA-Zà-úÀ-Ú]{2,})+$/;
        return regex.test(name);
    }

    async validateAndGetDocumentType(
        entity: Farmer,
    ): Promise<DocumentTypeEnum> {
        if (entity.document.length === 11) {
            return DocumentTypeEnum.CPF;
        } else if (entity.document.length === 14) {
            return DocumentTypeEnum.CNPJ;
        } else {
            return null;
        }
    }

    async checkIfDocumentExist(document: string): Promise<boolean> {
        const farmer = await this.farmerRepository.findOne({
            where: { document: document, deleted: false },
        });

        if (farmer) {
            return true;
        }

        return false;
    }
}
