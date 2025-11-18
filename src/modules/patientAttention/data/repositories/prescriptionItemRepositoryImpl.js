import { prescriptionItemApi } from '../datasource/prescriptionItemApi.js';
import { PrescriptionItem } from '../../domain/entities/prescriptionItem.js';

export class PrescriptionItemRepositoryImpl {
    async getByPrescriptionId(prescriptionId) {
        try {
            const raw = await prescriptionItemApi.getPrescriptionItems(prescriptionId);
            return (raw || []).map((item) => new PrescriptionItem(item));
        } catch (error) {
            console.error('Error fetching prescription items:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const raw = await prescriptionItemApi.createPrescriptionItem(data);
            return raw ? new PrescriptionItem(raw) : null;
        } catch (error) {
            console.error('Error creating prescription item:', error);
            throw error;
        }
    }

    async update(prescriptionItemId, data) {
        try {
            const raw = await prescriptionItemApi.updatePrescriptionItem(prescriptionItemId, data);
            return raw ? new PrescriptionItem(raw) : null;
        } catch (error) {
            console.error('Error updating prescription item:', error);
            throw error;
        }
    }

    async delete(prescriptionItemId) {
        try {
            await prescriptionItemApi.deletePrescriptionItem(prescriptionItemId);
        } catch (error) {
            console.error('Error deleting prescription item:', error);
            throw error;
        }
    }
}

export const prescriptionItemRepositoryImpl = new PrescriptionItemRepositoryImpl();
