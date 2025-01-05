import {
    Body,
    Delete,
    Get,
    InternalServerError,
    JsonController,
    Param,
    Post,
    Put,
    QueryParams,
    Res,
} from 'routing-controllers';
import { ResponseModel } from '../model/response-model';
import { PagingResultModel } from '../model/paging-result-model';
import { Harvest } from '../entity/harvest-entity';
import { HarvestService } from '../service/harvest-service';
import { HarvestFilterModel } from '../model/harvest-filter-model';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi';

@Service()
@JsonController('/harvest')
export class HarvestController {
    private className = 'HarvestController';

    constructor(private readonly harvestService: HarvestService) {}

    /**
     * POST /harvest
     * @summary Save a Harvest entity
     * @tags Harvest
     * @param {FarmerCreaterObject} request.body.required - farmer infos
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    @Post('')
    async create(
        @Body() req: HarvestFilterModel,
        @Res() res: any,
    ): Promise<ResponseModel<Harvest>> {
        const sessionUuid = uuidv4();
        logger.info(`${sessionUuid} - ${this.className}:create() START`);
        try {
            const savedHarvest = await this.harvestService.create(
                req,
                sessionUuid,
            );
            logger.info(`${sessionUuid} - ${this.className}:create() FINISH`);
            res.status(201);
            return new ResponseModel(201, savedHarvest);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${
                    this.className
                }:create()Error to save harvest [${JSON.stringify(req)}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
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
    @Get('')
    async read(
        @QueryParams() filter: HarvestFilterModel,
    ): Promise<PagingResultModel<Array<Harvest>>> {
        const sessionUuid = uuidv4();
        logger.info(`${sessionUuid} - ${this.className}:read() START`);
        try {
            filter.page = filter.page && filter.page > 0 ? filter.page : 1;
            filter.size = filter.size && filter.size > 0 ? filter.size : 20;
            const [harvest, totalQuantity] = await this.harvestService.find(
                filter,
                sessionUuid,
            );
            logger.info(`${sessionUuid} - ${this.className}:read() FINISH`);
            return new PagingResultModel(
                filter.page,
                totalQuantity,
                filter.size,
                harvest,
            );
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${
                    this.className
                }:read() Error to find harvester with filter: [${JSON.stringify(
                    filter,
                )}] error: [${JSON.stringify(error)}]`,
            );
            throw new InternalServerError(
                `Something went wrong - Contact the admin`,
            );
        }
    }

    /**
     * GET /harvest/{id}
     * @summary Get a Harvest entity by id
     * @tags Harvest
     * @param {number} id.path - Identificador da safra na base de dados
     * @return {ResponseModelHarvestObject} 200 - success response
     */
    @Get('/:id')
    async readById(@Param('id') id: number): Promise<ResponseModel<Harvest>> {
        const sessionUuid = uuidv4();
        const harvest = await this.harvestService.findById(id, sessionUuid);
        return new ResponseModel(200, harvest);
    }
    /**
     * PUT /harvest/{id}
     * @summary Update a Harvest entity
     * @tags Harvest
     * @param {number} id.path - Identificador da safra na base de dados
     * @return {ResponseModelHarvestObject} 200 - success response
     */
    @Put('/:id')
    async update(
        @Param('id') id: number,
        @Body() harvestInfos: Harvest,
        @Res() res: any,
    ): Promise<ResponseModel<Harvest>> {
        const sessionUuid = uuidv4();
        logger.info(
            `${sessionUuid} - ${this.className}:update() START to HarvestId: [${id}]`,
        );

        try {
            const harvest = await this.harvestService.update(
                id,
                harvestInfos,
                sessionUuid,
            );
            logger.info(
                `${sessionUuid} - ${this.className}:update() FINISH to HarvestId: [${id}]`,
            );
            return new ResponseModel(200, harvest);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${this.className}:update() Error to update harvestId: [${id}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }

    /**
     * DELETE /harvest/{id}
     * @summary Delete a Harvest entity
     * @tags Harvest
     * @param {number} id.path - Identificador da safra na base de dados
     * @return {ResponseModelHarvestObject} 200 - success response
     */
    @Delete('/:id')
    async deleteLogic(
        @Param('id') id: number,
        @Res() res: any,
    ): Promise<ResponseModel<Harvest>> {
        const sessionUuid = uuidv4();
        logger.info(
            `${sessionUuid} - ${this.className}:delete() START to HarvesterId: [${id}]`,
        );
        try {
            const harvest = await this.harvestService.delete(id, sessionUuid);
            logger.info(
                `${sessionUuid} - ${this.className}:delete() FINISH to HarvestId: [${id}]`,
            );
            return new ResponseModel(200, harvest);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${this.className}:delete() Error to deleted harvestId: [${id}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }
}
