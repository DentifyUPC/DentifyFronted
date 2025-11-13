import BaseService from '@/shared/serivces/BaseService.js';

class ClinicApi extends BaseService {
    constructor() {
        super('/clinic-management-service/api/v1/clinics');
    }

    async getClinicsForRegister() {
        return await this.get('/clinics-information-pre-register');
    }
}

export const clinicApi = new ClinicApi();
