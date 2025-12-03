import BaseService from '@/shared/services/baseService.js';

class AllergiasMedicationsApi extends BaseService {
    constructor() {
        super('/patient-attention-service/api/v1/allergias-medications');
    }

    async create(data) {
        return await this.post('', data);
    }

    async getById(allergiaMedicationId) {
        return await this.get(`/${allergiaMedicationId}`);
    }

    async getByClinicalRecordId(clinicalRecordId) {
        return await this.get(`/clinical-record/${clinicalRecordId}`);
    }

    async update(allergiaMedicationId, data) {
        return await this.put(`/${allergiaMedicationId}`, data);
    }

    async delete(allergiaMedicationId) {
        return await super.delete(`/${allergiaMedicationId}`);
    }
}

export const allergiasMedicationsApi = new AllergiasMedicationsApi();
