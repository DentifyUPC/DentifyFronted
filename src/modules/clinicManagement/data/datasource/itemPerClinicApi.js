import BaseService from '@/shared/services/BaseService.js';

class ItemPerClinicApi extends BaseService {
    constructor() {
        super('/clinic-management-service/api/v1/items-per-clinics');
    }

    async getByClinicId(clinicId) {
        return await this.get(`/${clinicId}`);
    }

    async create(payload) {
        return await this.post('', payload);
    }

    async update(id, payload) {
        return await this.put(`/${id}`, payload);
    }
}

export const itemPerClinicApi = new ItemPerClinicApi();
