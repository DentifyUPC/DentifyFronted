import BaseService from '@/shared/services/BaseService.js';

class PrescriptionApi extends BaseService {
    constructor() {
        super('/patient-attention-service/api/v1/prescriptions');
    }

    async getPrescription(prescriptionId) {
        return await this.get(`/${prescriptionId}`);
    }

    async updatePrescription(prescriptionId, data) {
        return await this.put(`/${prescriptionId}`, data);
    }

    async getPrescriptionByAppointmentId(appointmentId) {
        return await this.get(`/appointment/${appointmentId}`);
    }
}

export const prescriptionApi = new PrescriptionApi();
