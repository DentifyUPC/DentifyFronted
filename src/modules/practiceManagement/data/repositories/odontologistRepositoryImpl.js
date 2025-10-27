import { odontologistApi } from "../datasource/odontologistApi.js";
import { Odontologist } from "@/modules/practiceManagement/domain/entities/odontologist.js";

export const odontologistRepositoryImpl = {
    async getProfile(userId) {
        try {
            const data = await odontologistApi.getByUserId(userId);
            return new Odontologist(data);
        } catch (error) {
            console.error("❌ odontologistRepositoryImpl.getProfile error:", error);
            throw error;
        }
    },

    async getByOdontologistId(odontologistId) {
        try {
            const data = await odontologistApi.getByOdontologistId(odontologistId);
            return new Odontologist(data);
        } catch (error) {
            console.error("❌ getByOdontologistId error:", error);
            throw error;
        }
    },

    async updateProfile(odontologistId, payload) {
        const data = await odontologistApi.updateOdontologist(odontologistId, payload);
        return new Odontologist(data);
    },

    async getAllByClinic(clinicId) {
        const arr = await odontologistApi.getByClinicId(clinicId);
        return arr.map(a => new Odontologist(a));
    },
};
