import BaseService from '@/shared/serivces/BaseService.js';

class ItemPerServiceApi extends BaseService {
    constructor() {
        super('/service-catalog-service/api/v1/items-per-services');
    }

    async getByServiceId(serviceId) {
        return await this.get(`/${serviceId}`);
    }
}

export const itemPerServiceApi = new ItemPerServiceApi();
