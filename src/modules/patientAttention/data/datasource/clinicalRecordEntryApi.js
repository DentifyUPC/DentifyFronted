import BaseService from "@/shared/services/baseService.js";

class ClinicalRecordEntryApi extends BaseService {
    constructor() {
        super("/patient-attention-service/api/v1/clinical-record-entries");
    }

    getAllByClinicalRecordId(clinicalRecordId) {
        return this.get(`clinical-record-id/${clinicalRecordId}`);
    }

    getById(clinicalRecordEntryId) {
        return this.get(`${clinicalRecordEntryId}`);
    }

    update(clinicalRecordEntryId, data) {
        return this.put(`${clinicalRecordEntryId}`, data);
    }
}

export const clinicalRecordEntryApi = new ClinicalRecordEntryApi();
