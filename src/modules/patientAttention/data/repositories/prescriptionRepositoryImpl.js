import { prescriptionApi } from '../datasource/prescriptionApi.js';
import { Prescription } from '../../domain/entities/prescription.js';

export class PrescriptionRepositoryImpl {
    async getById(prescriptionId) {
        try {
            const raw = await prescriptionApi.getPrescription(prescriptionId);
            return raw ? new Prescription(raw) : null;
        } catch (error) {
            console.error('Error fetching prescription:', error);
            throw error;
        }
    }

    async update(prescriptionId, data) {
        try {
            const raw = await prescriptionApi.updatePrescription(prescriptionId, data);
            return raw ? new Prescription(raw) : null;
        } catch (error) {
            console.error('Error updating prescription:', error);
            throw error;
        }
    }

    async getByAppointmentId(appointmentId) {
        try {
            const raw = await prescriptionApi.getPrescriptionByAppointmentId(appointmentId);
            return raw ? new Prescription(raw) : null;
        } catch (error) {
            console.error('Error fetching prescription by appointment ID:', error);
            throw error;
        }
    }
}

export const prescriptionRepositoryImpl = new PrescriptionRepositoryImpl();
