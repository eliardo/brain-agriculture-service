import {
    BadRequestError,
    Body,
    Delete,
    Get,
    InternalServerError,
    JsonController,
    Param,
    Post,
    Put,
    QueryParams,
    Req,
    Res,
} from 'routing-controllers';
import { ResponseModel } from '../model/response-model';
import { PagingResultModel } from '../model/paging-result-model';
import { Farm } from '../entity/farm-entity';
import { FarmService } from '../service/farm-service';
import { FarmFilterModel } from '../model/farm-filter-model';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';
import './swagger-mapping';
import { Service } from 'typedi';
import { FarmSummaryReportModel } from '../model/farm-summary-report-model';
import { FarmSummaryByStateModel } from '../model/farm-summary-by-state-model';

@Service()
@JsonController('/farm')
export class FarmController {
    private className = 'FarmController';

    constructor(private readonly farmService: FarmService) {}

    /**
     * POST /farm
     * @summary Save a Farm entity
     * @tags Farm
     * @param {FarmCreaterObject} request.body.required - songs info
     * @return {ResponseModelFarmObject} 200 - success response
     */
    @Post('')
    async create(
        @Body() req: Farm,
        @Res() res: any,
    ): Promise<ResponseModel<Farm>> {
        const sessionUuid = uuidv4();
        logger.info(`${sessionUuid} - ${this.className}:create() START`);
        try {
            const savedFarm = await this.farmService.create(req, sessionUuid);
            logger.info(`${sessionUuid} - ${this.className}:create() FINISH`);
            res.status(201);
            return new ResponseModel(201, savedFarm);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${
                    this.className
                }:create()Error to save farm [${JSON.stringify(req)}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
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
    @Get('')
    async read(
        @QueryParams() filter: FarmFilterModel,
    ): Promise<PagingResultModel<Array<Farm>>> {
        const sessionUuid = uuidv4();
        logger.info(`${sessionUuid} - ${this.className}:read() START`);
        try {
            filter.page = filter.page && filter.page > 0 ? filter.page : 1;
            filter.size = filter.size && filter.size > 0 ? filter.size : 20;
            const [farm, totalQuantity] = await this.farmService.find(
                filter,
                sessionUuid,
            );
            logger.info(`${sessionUuid} - ${this.className}:read() FINISH`);
            return new PagingResultModel(
                filter.page,
                totalQuantity,
                filter.size,
                farm,
            );
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${
                    this.className
                }:read() Error to find farm with filter: [${JSON.stringify(
                    filter,
                )}] error: [${JSON.stringify(error)}]`,
            );
            throw new InternalServerError(
                `Something went wrong - Contact the admin`,
            );
        }
    }

    /**
     * GET /farm/summary
     * @summary Get total of farms registred and hectares
     * @tags Farm
     * @return {ResponseModelFarmReportObject} 200 - success response
     */
    @Get('/summary')
    async summary(
        @Req() req: any,
    ): Promise<ResponseModel<FarmSummaryReportModel>> {
        const sessionUuid = uuidv4();
        logger.info(`${sessionUuid} - ${this.className}:summary() START`);
        try {
            const farmSummary = await this.farmService.summary(sessionUuid);
            logger.info(`${sessionUuid} - ${this.className}:summary() FINISH`);
            return new ResponseModel(200, farmSummary);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${
                    this.className
                }:summary() Error to find farm error: [${JSON.stringify(
                    error,
                )}]`,
            );
            throw new InternalServerError(
                `Something went wrong - Contact the admin`,
            );
        }
    }

    /**
     * GET /farm/summary-by-state
     * @summary Get total of farms group by state
     * @tags Farm
     * @return {ResponseModelFarmReportByStateObject} 200 - success response
     */
    @Get('/summary-by-state')
    async summaryByState(
        @Req() req: any,
    ): Promise<ResponseModel<Array<FarmSummaryByStateModel>>> {
        const sessionUuid = uuidv4();
        logger.info(
            `${sessionUuid} - ${this.className}:summaryByState() START`,
        );
        try {
            const farmSummary = await this.farmService.summaryByState(
                sessionUuid,
            );
            logger.info(
                `${sessionUuid} - ${this.className}:summaryByState() FINISH`,
            );
            return new ResponseModel(200, farmSummary);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${
                    this.className
                }:summaryByState() Error to find farm error: [${JSON.stringify(
                    error,
                )}]`,
            );
            throw new InternalServerError(
                `Something went wrong - Contact the admin`,
            );
        }
    }

    /**
     * GET /farm/{id}
     * @summary Get a Farm entity by ID
     * @tags Farm
     * @param {number} id.path - Identificador da fazenda na base de dados
     * @return {ResponseModelFarmObject} 200 - success response
     */
    @Get('/:id')
    async readById(@Param('id') id: number, @Res() res: any,): Promise<ResponseModel<Farm>> {
        const sessionUuid = uuidv4();
        if (isNaN(Number(id))) {
            throw new BadRequestError(`Invalid ID: ${id} must be a number.`);
        }
        try {
            const farm = await this.farmService.findById(id, sessionUuid);
            return new ResponseModel(200, farm);
        } catch (error) {
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }

    /**
     * PUT /farm/{id}
     * @summary Update a Farm entity
     * @tags Farm
     * @param {number} id.path - Identificador da fazenda na base de dados
     * @return {ResponseModelFarmObject} 200 - success response
     */
    @Put('/:id')
    async update(
        @Param('id') id: number,
        @Body() farmInfos: Farm,
        @Res() res: any,
    ): Promise<ResponseModel<Farm>> {
        const sessionUuid = uuidv4();
        logger.info(
            `${sessionUuid} - ${this.className}:update() START to FarmId: [${id}]`,
        );

        try {
            const farm = await this.farmService.update(
                id,
                farmInfos,
                sessionUuid,
            );
            logger.info(
                `${sessionUuid} - ${this.className}:update() FINISH to FarmId: [${id}]`,
            );
            return new ResponseModel(200, farm);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${this.className}:update() Error to update farmId: [${id}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }

    /**
     * DELETE /farm/{id}
     * @summary Delete a Farm entity
     * @tags Farm
     * @param {number} id.path - Identificador da fazenda na base de dados
     * @return {ResponseModelFarmObject} 200 - success response
     */
    @Delete('/:id')
    async deleteLogic(
        @Param('id') id: number,
        @Res() res: any,
    ): Promise<ResponseModel<Farm>> {
        const sessionUuid = uuidv4();
        logger.info(
            `${sessionUuid} - ${this.className}:delete() START to FarmId: [${id}]`,
        );
        try {
            const farm = await this.farmService.delete(id, sessionUuid);
            logger.info(
                `${sessionUuid} - ${this.className}:delete() FINISH to FarmId: [${id}]`,
            );
            return new ResponseModel(200, farm);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${this.className}:delete() Error to deleted farmId: [${id}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }
}
