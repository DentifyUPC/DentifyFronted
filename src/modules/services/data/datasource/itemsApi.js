import BaseService from '@/shared/serivces/BaseService.js';

class ItemsApi extends BaseService {
    constructor() {
        super('/items');
    }

    async getAllItems() {
        return await this.get('');
    }

}

export const itemsApi = new ItemsApi();
