import { describe, expect, it, beforeAll } from '@jest/globals';
import { FarmerService } from '../../src/service/farmer-service';
import { Farmer } from '../../src/entity/farmer-entity';
import { DocumentTypeEnum } from '../../src/entity/enum/document-type-enum';

describe('FarmService', () => {
    let farmerService: FarmerService;

    beforeAll(() => {
        farmerService = new FarmerService();
    });

    describe('FarmerService - Feature FULLNAME', () => {
        it('should Return FALSE when just firstName is informed', async () => {
            const isValid = farmerService.isValidFullName('justFirstName');
            expect(isValid).toBe(false);
        });

        it('should Return TRUE when just FULLNAME is informed', async () => {
            const isValid = farmerService.isValidFullName('jose da silva');
            expect(isValid).toBe(true);
        });
    });

    describe('FarmerService - Feature Document and DocumentType', () => {
        it('should NULL when invalid number is informed', async () => {
            const isValid = await farmerService.validateAndGetDocumentType({
                document: '1',
            } as Farmer);

            expect(isValid).toBe(null);
        });

        it('should enumDocumentType CPF when 11 numbers is informed', async () => {
            const enumDocumentType =
                await farmerService.validateAndGetDocumentType({
                    document: '12345678901',
                } as Farmer);

            expect(enumDocumentType).toBe(DocumentTypeEnum.CPF);
        });

        it('should enumDocumentType CNPJ when 14 numbers is informed', async () => {
            const enumDocumentType =
                await farmerService.validateAndGetDocumentType({
                    document: '12345678901234',
                } as Farmer);

            expect(enumDocumentType).toBe(DocumentTypeEnum.CNPJ);
        });
    });
});
