import BaseService from '@/shared/services/BaseService.js';

class PrescriptionItemApi extends BaseService {
    constructor() {
        super('/patient-attention-service/api/v1/prescription-items');
    }

    async getPrescriptionItems(prescriptionId) {
        return await this.get(`/prescription/${prescriptionId}`);
    }

    async createPrescriptionItem(data) {
        return await this.post('', data);
    }

    async updatePrescriptionItem(prescriptionItemId, data) {
        return await this.put(`/${prescriptionItemId}`, data);
    }

    async deletePrescriptionItem(prescriptionItemId) {
        return await this.delete(`/${prescriptionItemId}`);
    }
}

export const prescriptionItemApi = new PrescriptionItemApi();
