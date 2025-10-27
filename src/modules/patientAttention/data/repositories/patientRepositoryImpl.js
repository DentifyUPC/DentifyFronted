import { patientApi } from "../datasource/patientApi";
import { Patient } from "@/modules/patientAttention/domain/entities/patient.js";

export const patientRepositoryImpl = {
    async getProfile(userId) {
        return await patientApi.getByUserId(userId);
    }
    ,

    async updateProfile(patientId, data) {
        return await patientApi.updatePatient(patientId, data);
    },

    async getAllByClinic(clinicId) {
        return await patientApi.getByClinicId(clinicId);
    },

    async getByPatientId(patientId) {
        const response = await patientApi.getByPatientId(patientId);
        return response ? new Patient(response) : null;
    }
};
