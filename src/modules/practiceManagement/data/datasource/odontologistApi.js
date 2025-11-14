import BaseService from "@/shared/services/baseService.js";

class OdontologistApi extends BaseService {
    constructor() {
        super("/practice-management-service/api/v1/odontologists");
    }

    async getByUserId(userId) {
        return await this.get(`/user/${userId}`);
    }

    async getById(odontologistId) {
        return await this.get(`/${odontologistId}`);
    }

    async update(odontologistId, payload) {
        return await this.put(`/${odontologistId}`, payload);
    }

    async getByClinicId(clinicId) {
        return await this.get(`/clinics/${clinicId}/odontologists`);
    }

    async getByShiftName(shiftName) {
        return await this.get(`/shift/${shiftName}/odontologists`);
    }
}

export const odontologistApi = new OdontologistApi();
