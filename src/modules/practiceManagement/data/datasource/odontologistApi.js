import BaseService from "@/shared/serivces/baseService.js";

class OdontologistApi extends BaseService {
    constructor() {
        super("/odontologists");
    }

    getByUserId(userId) {
        return this.get(`user/${userId}`);
    }

    getByOdontologistId(odontologistId) {
        return this.get(`${odontologistId}`);
    }
    updateOdontologist(odontologistId, data) {
        return this.put(`${odontologistId}`, data);
    }

    getByClinicId(clinicId) {
        return this.get(`clinics/${clinicId}/odontologists`);
    }
}

export const odontologistApi = new OdontologistApi();
