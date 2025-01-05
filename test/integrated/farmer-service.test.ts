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
import app from '../../src/app'

describe('Farmer Controller', () => {
    beforeAll(async () => {
        await AppDataSource.initialize();
        await AppDataSource.runMigrations();
    });

    afterEach(async () => {
        const repository = AppDataSource.getRepository(Farmer);
        await repository.delete({});
    });

    describe('Create farmer API', () => {
        ///SUCESS
        it('Should create a farmer with CPF and return object saved POST /farmer', async () => {
            const newFarmer = {
                name: 'Eliardo Marini',
                document: '12345678901',
            };
            const response = await request(app).post('/farmer').send(newFarmer);
            expect(response.status).toBe(201);
            expect(response.body.payload).toBeDefined();
            expect(response.body.payload.name).toBe(newFarmer.name);
            expect(response.body.payload.documentType).toBe(
                DocumentTypeEnum.CPF,
            );
        });

        it('Should create a farmer with CNPJ and return object saved POST /farmer', async () => {
            const newFarmer = {
                name: 'Eliardo Marini',
                document: '12345678901234',
            };
            const response = await request(app).post('/farmer').send(newFarmer);
            expect(response.status).toBe(201);
            expect(response.body.payload).toBeDefined();
            expect(response.body.payload.name).toBe(newFarmer.name);
            expect(response.body.payload.documentType).toBe(
                DocumentTypeEnum.CNPJ,
            );
        });

        // INVALID DATA REQUEST
        it('Should return error invalid name when POST /farmer', async () => {
            const newFarmer = { name: 'Eliardo', document: '12345678901234' };
            const response = await request(app).post('/farmer').send(newFarmer);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('Should return error invalid document when POST /farmer', async () => {
            const newFarmer = { name: 'Eliardo Marini', document: '123434' };
            const response = await request(app).post('/farmer').send(newFarmer);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('Should create a farmer without document when POST /farmer', async () => {
            const newFarmer = {
                name: 'Eliardo Marini',
            };
            const response = await request(app).post('/farmer').send(newFarmer);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('Should create a farmer without name when POST /farmer', async () => {
            const newFarmer = {
                document: '12345678901',
            };
            const response = await request(app).post('/farmer').send(newFarmer);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        //INVALID BY BUSSINESS RULE
        it('Should return error save duplicated farmer document when POST /farmer', async () => {
            const newFarmer = {
                name: 'Eliardo Marini',
                document: '12345678901',
                documentType: DocumentTypeEnum.CPF,
                documentTypeName: 'CPF',
            };
            const repository = AppDataSource.getRepository(Farmer);
            await repository.save(newFarmer);

            const response = await request(app).post('/farmer').send(newFarmer);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });



    describe('Get farmer API', () => {

        const newFarmerToInsert = {
            name: 'Eliardo Marini',
            document: '12345678901',
            documentType: DocumentTypeEnum.CPF,
            documentTypeName: 'CPF',
        };

        //Sucess GET BY ID
        it('Should return farmer by id when GET /farmer/{id}', async () => {
            const repository = AppDataSource.getRepository(Farmer);
            const savedFarmer = await repository.save(newFarmerToInsert);

            const response = await request(app).get(`/farmer/${savedFarmer.id}`)
            expect(response.status).toBe(200);
            expect(response.body.payload.name).toBe(savedFarmer.name);
        });

        //Not Found GET BY ID
        it('Should return error 404 by id when GET /farmer/{id}', async () => {
            const response = await request(app).get(`/farmer/1001`)
            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });


        it('Should return farmers paginated when GET /farmer', async () => {
            const repository = AppDataSource.getRepository(Farmer);
            const savedFarmer = await repository.save(newFarmerToInsert);

            const response = await request(app).get(`/farmer`)
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.currentPage).toBe(1);
            expect(response.body.itens.length).toBe(1);
        });


        it('Should return farmers paginated without itens when GET /farmer ', async () => {
            const response = await request(app).get(`/farmer`)
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(0);
            expect(response.body.currentPage).toBe(1);
            expect(response.body.itens.length).toBe(0);
        });

        it('Should return farmers paginated filtred by name and document when GET /farmer', async () => {
            const repository = AppDataSource.getRepository(Farmer);
            const savedFarmer = await repository.save(newFarmerToInsert);

            const response = await request(app).get(`/farmer?document=${savedFarmer.document}&name=${savedFarmer.name}`)
            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.currentPage).toBe(1);
            expect(response.body.itens.length).toBe(1);
            expect(response.body.itens[0].name).toBe(savedFarmer.name);
            expect(response.body.itens[0].document).toBe(savedFarmer.document);
        });
    });



    describe('Delete farmer API', () => {
        const newFarmerToInsert = {
            name: 'Eliardo Marini',
            document: '12345678901',
            documentType: DocumentTypeEnum.CPF,
            documentTypeName: 'CPF',
        };

        it('Should Delete logical farmer by id when Delete /farmer/{id}', async () => {
            const repository = AppDataSource.getRepository(Farmer);
            const savedFarmer = await repository.save(newFarmerToInsert);

            const response = await request(app).delete(`/farmer/${savedFarmer.id}`);

            const logicalDeletedFarmer = await repository.findOne({ where: { id: savedFarmer.id } })
            expect(response.status).toBe(200);
            expect(response.body.payload.name).toBe(savedFarmer.name);
            expect(logicalDeletedFarmer?.deleted).toBe(true);
        });

        it('Should return error 404 on try delete farmer not found when GET /farmer/{id}', async () => {
            const response = await request(app).delete(`/farmer/1001`)
            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });


    describe('Upload farmer API', () => {
        const newFarmerToInsert = {
            name: 'Eliardo Marini',
            document: '12345678901',
            documentType: DocumentTypeEnum.CPF,
            documentTypeName: 'CPF',
        };

        it('Should Update farmer name by id when PUT /farmer/{id}', async () => {
            const repository = AppDataSource.getRepository(Farmer);
            const savedFarmer = await repository.save(newFarmerToInsert);

            const response = await request(app).put(`/farmer/${savedFarmer.id}`).send({name: "updated name"});

            expect(response.status).toBe(200);
            expect(response.body.payload.name).toBe("updated name");
            expect(response.body.payload.document).toBe(savedFarmer.document);
            expect(response.body.payload.id).toBe(savedFarmer.id);
        });
        

        it('Should Update farmer document by id when PUT /farmer/{id}', async () => {
            const repository = AppDataSource.getRepository(Farmer);
            const savedFarmer = await repository.save(newFarmerToInsert);

            const response = await request(app).put(`/farmer/${savedFarmer.id}`).send({document: "12345678901234"});

            expect(response.status).toBe(200);
            expect(response.body.payload.documentType).toBe(DocumentTypeEnum.CNPJ);
            expect(response.body.payload.documentTypeName).toBe("CNPJ");
            expect(response.body.payload.document).toBe("12345678901234");
            expect(response.body.payload.id).toBe(savedFarmer.id);
        });


        it('Should return error 404 on try update farmer not found when PUT /farmer/{id}', async () => {
            const response = await request(app).put(`/farmer/1001`)
            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });
});
