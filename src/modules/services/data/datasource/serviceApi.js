import BaseService from '@/shared/serivces/BaseService.js';

class ServicesApi extends BaseService {
    constructor() {
        super('/services');
    }

    async getAllServices() {
        return await this.get('');
    }
}

export const servicesApi = new ServicesApi();
