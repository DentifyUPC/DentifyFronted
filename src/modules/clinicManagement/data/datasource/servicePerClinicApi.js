import BaseService from '@/shared/serivces/BaseService.js';

class ServicePerClinicApi extends BaseService {
    constructor() {
        super('/clinic-management-service/api/v1/services-per-clinics');
    }

    async create(payload) {
        return await this.post('', payload);
    }
}

export const servicePerClinicApi = new ServicePerClinicApi();
