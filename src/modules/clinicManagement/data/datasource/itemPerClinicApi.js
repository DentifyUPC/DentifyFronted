import BaseService from '@/shared/serivces/BaseService.js';

class ItemPerClinicApi extends BaseService {
    constructor() {
        super('/items-per-clinics');
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
