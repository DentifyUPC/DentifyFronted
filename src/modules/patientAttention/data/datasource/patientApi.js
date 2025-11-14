import BaseService from "@/shared/services/baseService.js";

class PatientApi extends BaseService {
    constructor() {
        super("/patient-attention-service/api/v1/patients");
    }


    getByUserId(userId) {
        return this.get(`user/${userId}`);
    }


    getByPatientId(patientId) {
        return this.get(`${patientId}`);
    }


    updatePatient(patientId, data) {
        return this.put(`${patientId}`, data);
    }


    getByClinicId(clinicId) {

        return this.get(`/clinics/${clinicId}/patients`);
    }
}

export const patientApi = new PatientApi();
