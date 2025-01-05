import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { AppDataSource } from '../database/data-source';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { Harvest } from '../entity/harvest-entity';
import { HarvestFilterModel } from '../model/harvest-filter-model';
import { FarmService } from './farm-service';
import { logger } from '../config/logger';

@Service()
export class HarvestService {
    private className = 'HarvestService';

    private readonly harvestRepository: Repository<Harvest>;
    constructor(readonly farmService: FarmService) {
        this.harvestRepository = AppDataSource.getRepository(Harvest);
    }

    async create(
        request: HarvestFilterModel,
        sessionUuid: string,
    ): Promise<Harvest> {
        if (!request.farmId) {
            throw new BadRequestError(`FarmId is mandatory`);
        }

        const farm = await this.farmService.checkIfExist(request.farmId);
        if (!farm) {
            throw new NotFoundError(
                `Harvester with id [${request.farmId}] not found`,
            );
        }
        const entity = Object.assign(new Harvest(), request);
        entity.farm = farm;

        logger.info(`${sessionUuid} - ${this.className}:create() try save`);
        return this.harvestRepository.save(entity);
    }

    async findById(harvestId: number, sessionUuid: string): Promise<Harvest> {
        logger.info(
            `${sessionUuid} - ${this.className}:findById() id: ${harvestId}`,
        );
        const harvest = await this.harvestRepository.findOne({
            where: { id: harvestId },
        });
        if (!harvest) {
            throw new NotFoundError(
                `Harvest with id: [${harvestId}] not found`,
            );
        }
        return harvest;
    }

    async find(
        filter: HarvestFilterModel,
        sessionUuid: string,
    ): Promise<[Harvest[], number]> {
        let whereFilter: any = {};

        whereFilter = { ...whereFilter, deleted: false };

        if (filter.id) {
            whereFilter = { ...whereFilter, id: filter.id };
        }

        if (filter.culture) {
            whereFilter = { ...whereFilter, culture: filter.culture };
        }

        if (filter.year) {
            whereFilter = { ...whereFilter, year: filter.year };
        }

        if (filter.farmId) {
            whereFilter = {
                ...whereFilter,
                farm: { id: filter.farmId },
            };
        }
        logger.info(
            `${sessionUuid} - ${this.className}:find() filter ${JSON.stringify(
                whereFilter,
            )}`,
        );

        const skip = (filter.page - 1) * filter.size;
        return this.harvestRepository.findAndCount({
            where: whereFilter,
            skip: skip,
            take: filter.size,
        });
    }

    async update(
        harvestId: number,
        harvestInfos: Harvest,
        sessionUuid: string,
    ): Promise<Harvest> {
        const harvest = await this.harvestRepository.findOne({
            where: { id: harvestId, deleted: false },
        });
        if (!harvest) {
            throw new NotFoundError(
                `Harvest with id: [${harvestId}] not found`,
            );
        }
        await this.harvestRepository.update(harvestId, harvestInfos);

        logger.info(
            `${sessionUuid} - ${this.className}:update() harvestId ${harvestId} updated`,
        );
        return this.harvestRepository.findOne({ where: { id: harvestId } });
    }

    async delete(harvestId: number, sessionUuid: string): Promise<Harvest> {
        const harvest = await this.harvestRepository.findOne({
            where: { id: harvestId, deleted: false },
        });
        if (!harvest) {
            throw new NotFoundError(
                `Harvest with id: [${harvestId}] not found`,
            );
        }
        await this.harvestRepository.update(harvestId, { deleted: true });

        logger.info(
            `${sessionUuid} - ${this.className}:delete() harvestId ${harvestId} deleted`,
        );
        return this.harvestRepository.findOne({ where: { id: harvestId } });
    }
}
