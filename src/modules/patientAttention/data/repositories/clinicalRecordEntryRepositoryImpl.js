import { clinicalRecordEntryApi } from '../datasource/clinicalRecordEntryApi.js';
import { ClinicalRecordEntry } from '../../domain/entities/clinicalRecordEntry.js';

export class ClinicalRecordEntryRepositoryImpl {
    async getAllByClinicalRecordId(clinicalRecordId) {
        try {
            const rawList = await clinicalRecordEntryApi.getAllByClinicalRecordId(clinicalRecordId);
            return rawList ? rawList.map(item => new ClinicalRecordEntry(item)) : [];
        } catch (error) {
            console.error('Error fetching clinical record entries:', error);
            throw error;
        }
    }

    async getById(clinicalRecordEntryId) {
        try {
            const raw = await clinicalRecordEntryApi.getById(clinicalRecordEntryId);
            return raw ? new ClinicalRecordEntry(raw) : null;
        } catch (error) {
            console.error('Error fetching clinical record entry:', error);
            throw error;
        }
    }

    async update(clinicalRecordEntryId, data) {
        try {
            const raw = await clinicalRecordEntryApi.update(clinicalRecordEntryId, data);
            return raw ? new ClinicalRecordEntry(raw) : null;
        } catch (error) {
            console.error('Error updating clinical record entry:', error);
            throw error;
        }
    }
}

export const clinicalRecordEntryRepositoryImpl = new ClinicalRecordEntryRepositoryImpl();
