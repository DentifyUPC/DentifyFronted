import BaseService from '@/shared/services/baseService.js';

class ServicePerClinicApi extends BaseService {
    constructor() {
        super('/clinic-management-service/api/v1/services-per-clinics');
    }

    async create(payload) {
        return await this.post('', payload);
    }

    async update(id, payload) {
        return await this.put(`/${id}`, payload);
    }

    async getAllByClinic(clinicId) {
        return await this.get(`/${clinicId}`);
    }
}

export const servicePerClinicApi = new ServicePerClinicApi();
