import { patientApi } from "../datasource/patientApi";
import {Patient} from "@/modules/patientAttention/domain/entities/patient.js";

export const patientRepositoryImpl = {
    async getProfile(userId) {
        const response = await patientApi.getByUserId(userId);
        return new Patient(response);
    },
    async updateProfile(patientId, data) {
        return await patientApi.updatePatient(patientId, data);
    },
    async getAllByClinic(clinicId) {
        return await patientApi.getByClinicId(clinicId);
    }
};
