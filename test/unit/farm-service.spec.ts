import {
    describe,
    expect,
    it,
    beforeAll,
} from '@jest/globals';
import { FarmerService } from '../../src/service/farmer-service';
import { FarmService } from '../../src/service/farm-service';
import { FarmFilterModel } from '../../src/model/farm-filter-model';


describe('FarmService', () => {

    let farmerService: FarmerService;
    let farmService: FarmService;

   beforeAll(() => {
        farmerService = new FarmerService();
        farmService = new FarmService(farmerService);
   })

    describe('FarmService - Feature validate area', () => {
        it('should Return FALSE when preservation + cultivable sum is different of total area', async () => {

            const farmInvalidArea = {
                totalArea: 10,
                totalPreservationArea: 5,
                totalCultivableArea: 9,
            } as FarmFilterModel;
            const isValid = farmService.isValidFarmArea(farmInvalidArea);

            expect(isValid).toBe(false);
        });

        it('should Return TRUE when preservation + cultivable sum is different of total area', async () => {
            const farmIsValidArea = {
                totalArea: 10,
                totalPreservationArea: 1,
                totalCultivableArea: 9,
            } as FarmFilterModel;
            const isValid = farmService.isValidFarmArea(farmIsValidArea);

            expect(isValid).toBe(true);
        });
    });

});

