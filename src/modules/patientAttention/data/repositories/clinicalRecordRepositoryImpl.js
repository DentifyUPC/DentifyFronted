import { clinicalRecordApi } from '../datasource/clinicalRecordApi.js';
import { ClinicalRecord } from '../../domain/entities/clinicalRecord.js';

export class ClinicalRecordRepositoryImpl {
    async getByPatientId(patientId) {
        try {
            const raw = await clinicalRecordApi.getByPatientId(patientId);
            return raw ? new ClinicalRecord(raw) : null;
        } catch (error) {
            console.error('Error fetching clinical record:', error);
            throw error;
        }
    }
}

export const clinicalRecordRepositoryImpl = new ClinicalRecordRepositoryImpl();
