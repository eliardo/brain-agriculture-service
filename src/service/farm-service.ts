import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { Farm } from '../entity/farm-entity';
import { FarmFilterModel } from '../model/farm-filter-model';
import { FarmerService } from './farmer-service';
import { logger } from '../config/logger';
import { AppDataSource } from '../database/data-source';
import { FarmSummaryReportModel } from '../model/farm-summary-report-model';
import { FarmSummaryByStateModel } from '../model/farm-summary-by-state-model';

@Service()
export class FarmService {
    private className = 'FarmService';

    private readonly farmRepository: Repository<Farm>;

    constructor(readonly farmerService: FarmerService) {
        this.farmRepository = AppDataSource.getRepository(Farm);
    }

    async create(request: FarmFilterModel, sessionUuid: string): Promise<Farm> {
        const isValidArea = this.isValidFarmArea(request);
        if (!isValidArea) {
            throw new BadRequestError(
                `Sum of [totalCultivableArea] and [totalPreservationArea] must be equals [totalArea]`,
            );
        }

        if (!request.farmerId) {
            throw new BadRequestError(`FarmerId is mandatory`);
        }
        const farmer = await this.farmerService.checkIfExist(request.farmerId);
        if (!farmer) {
            logger.info(
                `${sessionUuid} - ${this.className}:create() Farm id [${request.farmerId}] not found`,
            );
            throw new NotFoundError(
                `Farmer with id [${request.farmerId}] not found`,
            );
        }
        const entity = Object.assign(new Farm(), request);
        entity.farmer = farmer;

        return this.farmRepository.save(entity);
    }

    async findById(farmId: number, sessionUuid: string): Promise<Farm> {
        logger.info(
            `${sessionUuid} - ${this.className}:findById() Farm id [${farmId}]`,
        );
        const farm = await this.farmRepository.findOne({
            where: { id: farmId },
            relations: ['farmer', 'harvests'],
        });
        if (!farm) {
            throw new NotFoundError(`Farm with id: [${farmId}] not found`);
        }
        return farm;
    }

    async find(
        filter: FarmFilterModel,
        sessionUuid: string,
    ): Promise<[Farm[], number]> {
        let whereFilter: any = {};

        whereFilter = { ...whereFilter, deleted: false };

        if (filter.id) {
            whereFilter = { ...whereFilter, id: filter.id };
        }

        if (filter.name) {
            whereFilter = { ...whereFilter, name: filter.name };
        }

        if (filter.city) {
            whereFilter = { ...whereFilter, city: filter.city };
        }

        if (filter.state) {
            whereFilter = { ...whereFilter, state: filter.state };
        }

        if (filter.farmerId) {
            whereFilter = { ...whereFilter, farmer: { id: filter.farmerId } };
        }

        const skip = (filter.page - 1) * filter.size;

        logger.info(
            `${sessionUuid} - ${
                this.className
            }:find() Farm with filter: ${JSON.stringify(whereFilter)}`,
        );
        return this.farmRepository.findAndCount({
            where: whereFilter,
            skip: skip,
            take: filter.size,
            /*relations: ['farmer']*/
        });
    }

    async checkIfExist(farmId: number): Promise<Farm> {
        return this.farmRepository.findOne({ where: { id: farmId } });
    }

    async update(
        farmId: number,
        farmInfos: Farm,
        sessionUuid: string,
    ): Promise<Farm> {
        const farm = await this.farmRepository.findOne({
            where: { id: farmId, deleted: false },
        });
        if (!farm) {
            throw new NotFoundError(`Farm with id: [${farmId}] not found`);
        }

        if(farmInfos.totalArea || farmInfos.totalCultivableArea || farmInfos.totalPreservationArea){
            const isValidArea = this.isValidFarmArea(farmInfos);
            if (!isValidArea) {
                throw new BadRequestError(
                    `Sum of [totalCultivableArea] and [totalPreservationArea] must be equals [totalArea]`,
                );
            }
        }

        await this.farmRepository.update(farmId, farmInfos);

        logger.info(
            `${sessionUuid} - ${this.className}:update() Farm id [${farmId}] updated`,
        );
        return this.farmRepository.findOne({ where: { id: farmId } });
    }

    async delete(farmId: number, sessionUuid: string): Promise<Farm> {
        const farm = await this.farmRepository.findOne({
            where: { id: farmId, deleted: false },
        });
        if (!farm) {
            throw new NotFoundError(`Farm with id: [${farmId}] not found`);
        }
        await this.farmRepository.update(farmId, { deleted: true });

        logger.info(
            `${sessionUuid} - ${this.className}:delete() Farm id [${farmId}] deleted`,
        );
        return this.farmRepository.findOne({ where: { id: farmId } });
    }

    isValidFarmArea(request: FarmFilterModel): boolean {
        if (
            request.totalArea !==
            request.totalCultivableArea + request.totalPreservationArea
        ) {
            return false;
        }

        return true;
    }

    async summary(sessionUuid: string): Promise<FarmSummaryReportModel> {
        logger.info(`${sessionUuid} - ${this.className}:summary() START`);

        const result = await this.farmRepository
            .createQueryBuilder('farm')
            .select([
                'COUNT(farm.id) AS "farmQtdTotal"',
                'COALESCE(SUM(farm.totalArea), 0) AS "sumTotalArea"',
                'COALESCE(SUM(farm.totalPreservationArea), 0) AS "sumTotalPreservationArea"',
                'COALESCE(SUM(farm.totalCultivableArea), 0) AS "sumTotalCultivableArea"',
            ])
            .where('farm.deleted = :deleted', { deleted: false })
            .getRawOne();
        logger.info(`${sessionUuid} - ${this.className}:summary() FINISH`);
        return result as FarmSummaryReportModel;
    }

    async summaryByState(sessionUuid: string): Promise<Array<FarmSummaryByStateModel>> {
        logger.info(`${sessionUuid} - ${this.className}:summary() START`);

        const result = await this.farmRepository
            .createQueryBuilder('farm')
            .select([
                'state as "state"',
                'COUNT(farm.id) AS "farmQtdTotal"',
                'COALESCE(SUM(farm.totalArea), 0) AS "sumTotalArea"',
                'COALESCE(SUM(farm.totalPreservationArea), 0) AS "sumTotalPreservationArea"',
                'COALESCE(SUM(farm.totalCultivableArea), 0) AS "sumTotalCultivableArea"',
            ])
            .where('farm.deleted = :deleted', { deleted: false })
            .groupBy('state')
            .getRawMany();
        logger.info(`${sessionUuid} - ${this.className}:summary() FINISH`);
        return result;;
    }
}
