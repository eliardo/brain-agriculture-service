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
import { FarmerService } from '../service/farmer-service';
import { Farmer } from '../entity/farmer-entity';
import { ResponseModel } from '../model/response-model';
import { FarmerFilterModel } from '../model/farmer-filter-model';
import { PagingResultModel } from '../model/paging-result-model';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';
import './swagger-mapping';
import { Service } from 'typedi';

@Service()
@JsonController('/farmer')
export class FarmerController {
    private className = 'FarmerController';
    constructor(readonly farmerService: FarmerService) {}

    /**
     * POST /farmer
     * @summary Save a Farmer entity
     * @tags Farmer
     * @param {FarmerCreaterObject} request.body.required - farmer infos
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    @Post('')
    async create(
        @Body() req: Farmer,
        @Res() res: any,
    ): Promise<ResponseModel<Farmer>> {
        const sessionUuid = uuidv4();
        logger.info(`${sessionUuid} - ${this.className}:create() START`);
        try {
            const savedFarmer = await this.farmerService.create(
                req,
                sessionUuid,
            );
            logger.info(`${sessionUuid} - ${this.className}:create() FINISH`);
            res.status(201);
            return new ResponseModel(201, savedFarmer);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${this.className}:create() Error to save farmer with document: [${req.document}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
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
    @Get('')
    async read(
        @QueryParams() filter: FarmerFilterModel,
        @Res() res: any,
    ): Promise<PagingResultModel<Array<Farmer>> | ResponseModel<any>> {
        const sessionUuid = uuidv4();
        logger.info(`${sessionUuid} - ${this.className}:read() START`);
        try {
            filter.page = filter.page && filter.page > 0 ? filter.page : 1;
            filter.size = filter.size && filter.size > 0 ? filter.size : 20;
            const [farmers, totalQuantity] = await this.farmerService.find(
                filter,
                sessionUuid,
            );
            logger.info(`${sessionUuid} - ${this.className}:read() FINISH`);
            return new PagingResultModel(
                filter.page,
                totalQuantity,
                filter.size,
                farmers,
            );
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${
                    this.className
                }:read() Error to find farmer with filter: [${JSON.stringify(
                    filter,
                )}] - error: ${JSON.stringify(error)}`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }

    /**
     * GET /farmer/{id}
     * @summary Get by Id a Farmer entity
     * @tags Farmer
     * @param {number} id.path - Identificador do fazendeiro na base de dados
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    @Get('/:id')
    async readById(@Param('id') id: number,  @Res() res: any,): Promise<ResponseModel<Farmer>> {
        const sessionUuid = uuidv4();
        try {
            const farmer = await this.farmerService.findById(id, sessionUuid);
            return new ResponseModel(200, farmer);
        } catch (error) {
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }

    /**
     * PUT /farmer/{id}
     * @summary Update a Farmer entity
     * @tags Farmer
     * @param {number} id.path - Identificador do fazendeiro na base de dados
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    @Put('/:id')
    async update(
        @Param('id') id: number,
        @Body() farmerInfos: Farmer,
        @Res() res: any,
    ): Promise<ResponseModel<Farmer>> {
        const sessionUuid = uuidv4();
        logger.info(
            `${sessionUuid} - ${this.className}:update() START to FarmerId: [${id}]`,
        );

        try {
            const farmer = await this.farmerService.update(
                id,
                farmerInfos,
                sessionUuid,
            );
            logger.info(
                `${sessionUuid} - ${this.className}:update() FINISH to FarmerId: [${id}]`,
            );
            return new ResponseModel(200, farmer);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${this.className}:update() Error to update farmerId: [${id}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }

    /**
     * DELETE /farmer/{id}
     * @summary Delete a Farmer entity
     * @tags Farmer
     * @param {number} id.path - Identificador do fazendeiro na base de dados
     * @return {ResponseModelFarmerObject} 200 - success response
     */
    @Delete('/:id')
    async deleteLogic(
        @Param('id') id: number,
        @Res() res: any,
    ): Promise<ResponseModel<Farmer>> {
        const sessionUuid = uuidv4();
        logger.info(
            `${sessionUuid} - ${this.className}:delete() START to FarmerId: [${id}]`,
        );
        try {
            const farmer = await this.farmerService.delete(id, sessionUuid);
            logger.info(
                `${sessionUuid} - ${this.className}:delete() FINISH to FarmerId: [${id}]`,
            );
            return new ResponseModel(200, farmer);
        } catch (error) {
            logger.error(
                `${sessionUuid} - ${this.className}:delete() Error to deleted farmerId: [${id}]`,
            );
            res.status(error.code || error.httpCode);
            return new ResponseModel(
                error.code || error.httpCode,
                error.message,
            );
        }
    }
}
