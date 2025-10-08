import BaseService from "@/shared/serivces/baseService";

class PatientApi extends BaseService {
    constructor() {
        super("/patients");
    }

    getByUserId(userId) {
        return this.get(`user/${userId}`);
    }

    updatePatient(patientId, data) {
        return this.put(`${patientId}`, data);
    }

    getByClinicId(clinicId) {
        return this.get(`clinics/${clinicId}/patients`);
    }
}

export const patientApi = new PatientApi();
