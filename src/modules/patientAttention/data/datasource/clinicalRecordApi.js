import BaseService from "@/shared/services/baseService.js";

class ClinicalRecordApi extends BaseService {
    constructor() {
        super("/patient-attention-service/api/v1/clinical-records");
    }

    getByPatientId(patientId) {
        return this.get(`patient-id/${patientId}`);
    }
}

export const clinicalRecordApi = new ClinicalRecordApi();
