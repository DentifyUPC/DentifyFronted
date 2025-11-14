import BaseService from '@/shared/services/BaseService.js';

class ServicesApi extends BaseService {
    constructor() {
        super('/service-catalog-service/api/v1/services');
    }

    async getAllServices() {
        return await this.get('');
    }
}

export const servicesApi = new ServicesApi();
