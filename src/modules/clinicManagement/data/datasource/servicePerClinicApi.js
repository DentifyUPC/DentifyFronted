import BaseService from '@/shared/serivces/BaseService.js';

class ServicePerClinicApi extends BaseService {
    constructor() {
        super('/services-per-clinics');
    }

    async create(payload) {
        return await this.post('', payload);
    }
}

export const servicePerClinicApi = new ServicePerClinicApi();
