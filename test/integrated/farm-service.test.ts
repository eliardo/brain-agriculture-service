import {
    beforeAll,
    afterAll,
    it,
    expect,
    describe,
    afterEach,
} from '@jest/globals';
import request from 'supertest';
import { AppDataSource } from '../../src/database/data-source';
import { Farmer } from '../../src/entity/farmer-entity';
import { DocumentTypeEnum } from '../../src/entity/enum/document-type-enum';
import app from '../../src/app';
import { Farm } from '../../src/entity/farm-entity';

describe('Farm Controller', () => {
    let farmer;
    beforeAll(async () => {
        await AppDataSource.initialize();
        await AppDataSource.runMigrations();

        const newFarmer = {
            name: 'Eliardo Marini',
            document: '12345678901',
            documentType: DocumentTypeEnum.CPF,
            documentTypeName: 'CPF',
        };
        farmer = await AppDataSource.getRepository(Farmer).save(newFarmer);
    });

    afterEach(async () => {
        const repository = AppDataSource.getRepository(Farm);
        await repository.delete({});

        const repositoryFarmer = AppDataSource.getRepository(Farmer);
        await repositoryFarmer.delete({});
    });

    ///SUCESS
    it('Should create a farm and return object saved POST /farm', async () => {
        const newFarm = {
            name: 'Farm 1',
            totalArea: 20,
            totalCultivableArea: 10,
            totalPreservationArea: 10,
            city: 'São Paulo',
            state: 'SP',
            farmerId: farmer.id,
        };

        const response = await request(app).post('/farm').send(newFarm);
        expect(response.status).toBe(201);
        expect(response.body.payload).toBeDefined();
    });

    it('Should return error invalid area when POST /farm', async () => {
        const newFarm = {
            name: 'Farm 1',
            totalArea: 20,
            totalCultivableArea: 11,
            totalPreservationArea: 12,
            city: 'São Paulo',
            state: 'SP',
            farmerId: farmer.id,
        };

        const response = await request(app).post('/farm').send(newFarm);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Should return error without farmerId when POST /farm', async () => {
        const newFarm = {
            name: 'Farm 1',
            totalArea: 20,
            totalCultivableArea: 10,
            totalPreservationArea: 10,
            city: 'São Paulo',
            state: 'SP',
            farmerId: null,
        };

        const response = await request(app).post('/farm').send(newFarm);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Should return error farmerId NOT FOUND when POST /farm', async () => {
        const newFarm = {
            name: 'Farm 1',
            totalArea: 20,
            totalCultivableArea: 10,
            totalPreservationArea: 10,
            city: 'São Paulo',
            state: 'SP',
            farmerId: 9999,
        };

        const response = await request(app).post('/farm').send(newFarm);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    ///FIND
    it('Should return farm by id when GET /farm/{id}', async () => {
        const farmToFind = {
            name: 'Fazenda Marini FM',
            totalArea: 30,
            totalPreservationArea: 22.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const repository = AppDataSource.getRepository(Farm);
        const savedFarm = await repository.save(farmToFind);

        const response = await request(app).get(`/farm/${savedFarm.id}`);
        expect(response.status).toBe(200);
        expect(response.body.payload.name).toBe(savedFarm.name);
    });

    it('Should return farm by id NOT FOUND when GET /farm/{id}', async () => {
        const response = await request(app).get(`/farm/1`);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('Should return farms paginated when GET /farm', async () => {
        const farmToFind = {
            name: 'Fazenda Marini FM',
            totalArea: 30,
            totalPreservationArea: 22.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const repository = AppDataSource.getRepository(Farm);
        await repository.save(farmToFind);

        const response = await request(app).get(`/farm`);
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(1);
        expect(response.body.currentPage).toBe(1);
        expect(response.body.itens.length).toBe(1);
    });

    ///Delete
    it('Should Delete logical farm by id when Delete /farm/{id}', async () => {
        const farmToFind = {
            name: 'Fazenda Marini FM',
            totalArea: 30,
            totalPreservationArea: 22.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const repository = AppDataSource.getRepository(Farm);
        const savedFarm = await repository.save(farmToFind);
        const response = await request(app).delete(`/farm/${savedFarm.id}`);

        const logicalDeletedFarmer = await repository.findOne({
            where: { id: savedFarm.id },
        });
        expect(response.status).toBe(200);
        expect(response.body.payload.name).toBe(farmToFind.name);
        expect(logicalDeletedFarmer?.deleted).toBe(true);
    });

    it('Should return error 404 on try delete farm not found when GET /farm/{id}', async () => {
        const response = await request(app).delete(`/farm/1001`);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    //Update
    it('Should Update farm name by id when PUT /farm/{id}', async () => {
        const farmToFind = {
            name: 'Fazenda Marini FM',
            totalArea: 30,
            totalPreservationArea: 22.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const repository = AppDataSource.getRepository(Farm);
        const savedFarm = await repository.save(farmToFind);

        const response = await request(app)
            .put(`/farm/${savedFarm.id}`)
            .send({
                name: 'updated name',
                totalArea: 30,
                totalPreservationArea: 22.4,
                totalCultivableArea: 7.6,
            });

        expect(response.status).toBe(200);
        expect(response.body.payload.id).toBe(savedFarm.id);
    });

    it('Should return error to Update farm with invalid area when PUT /farm/{id}', async () => {
        const farmToFind = {
            name: 'Fazenda Marini FM',
            totalArea: 30,
            totalPreservationArea: 22.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const repository = AppDataSource.getRepository(Farm);
        const savedFarm = await repository.save(farmToFind);

        const response = await request(app)
            .put(`/farm/${savedFarm.id}`)
            .send({
                name: 'updated name',
                totalArea: 30,
                totalPreservationArea: 50.4,
                totalCultivableArea: 7.6,
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    //SUMMARY
    it('Should return a report of farms when GET /farm/summary', async () => {
        const farm1 = {
            name: 'Fazenda Marini FM',
            totalArea: 30,
            totalPreservationArea: 22.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const farm2 = {
            name: 'Fazenda Marini FM',
            totalArea: 20,
            totalPreservationArea: 12.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const repository = AppDataSource.getRepository(Farm);
        await repository.save(farm1);
        await repository.save(farm2);


        const response = await request(app).get(`/farm/summary`);
        expect(response.status).toBe(200);
        expect(response.body.payload.farmQtdTotal).toBe("2");
        expect(response.body.payload.sumTotalArea).toBe("50.00");

    });

    //SUMMARY BY STATE
    it('Should return a report of farms when GET /farm/summary-by-state', async () => {
        const farm1 = {
            name: 'Fazenda Marini FM',
            totalArea: 30,
            totalPreservationArea: 22.4,
            totalCultivableArea: 7.6,
            city: 'São Paulo',
            state: 'SP',
            farmerId: farmer.id,
        };
        const farm2 = {
            name: 'Fazenda Marini FM',
            totalArea: 20,
            totalPreservationArea: 12.4,
            totalCultivableArea: 7.6,
            city: 'Passo Fundo',
            state: 'RJ',
            farmerId: farmer.id,
        };
        const repository = AppDataSource.getRepository(Farm);
        await repository.save(farm1);
        await repository.save(farm2);


        const response = await request(app).get(`/farm/summary-by-state`);
        expect(response.status).toBe(200);
        expect(response.body.payload.length).toBe(2);

    });
});
