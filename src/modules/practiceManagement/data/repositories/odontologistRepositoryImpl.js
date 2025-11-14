import { odontologistApi } from "../datasource/odontologistApi.js";
import { Odontologist } from "@/modules/practiceManagement/domain/entities/odontologist.js";

export const odontologistRepositoryImpl = {
    async getProfile(userId) {
        try {
            const data = await odontologistApi.getByUserId(userId);
            return new Odontologist(data);
        } catch (error) {
            console.error("odontologistRepositoryImpl.getProfile error:", error);
            throw error.response?.data || error;
        }
    },

    async getById(odontologistId) {
        try {
            const data = await odontologistApi.getById(odontologistId);
            return new Odontologist(data);
        } catch (error) {
            console.error("odontologistRepositoryImpl.getById error:", error);
            throw error.response?.data || error;
        }
    },

    async updateProfile(odontologistId, payload) {
        try {
            const validPayload = {
                gender: payload.gender ?? null,
                street: payload.street ?? null,
                district: payload.district ?? null,
                province: payload.province ?? null,
                department: payload.department ?? null,
                phoneNumber: payload.phoneNumber ?? null,
                professionalLicenseNumber: payload.professionalLicenseNumber ?? null,
                specialtyRegistrationNumber: payload.specialtyRegistrationNumber ?? null,
                specialty: payload.specialty ?? null,
                serviceId: payload.serviceId ?? null,
                shiftName: payload.shiftName ?? null,
                isActive: payload.isActive ?? true,
            };

            const data = await odontologistApi.update(odontologistId, validPayload);
            return new Odontologist(data);
        } catch (error) {
            console.error("odontologistRepositoryImpl.updateProfile error:", error);
            throw error.response?.data || error;
        }
    },

    async getAllByClinic(clinicId) {
        try {
            const list = await odontologistApi.getByClinicId(clinicId);
            return list.map(item => new Odontologist(item));
        } catch (error) {
            console.error("odontologistRepositoryImpl.getAllByClinic error:", error);
            throw error.response?.data || error;
        }
    },

    async getByShiftName(shiftName) {
        try {
            const list = await odontologistApi.getByShiftName(shiftName);
            return list.map(item => new Odontologist(item));
        } catch (error) {
            console.error("odontologistRepositoryImpl.getByShiftName error:", error);
            throw error.response?.data || error;
        }
    },

    async getActiveByClinic(clinicId) {
        try {
            const all = await this.getAllByClinic(clinicId);
            return all.filter(odon => odon.isActive && odon.canTakeAppointments);
        } catch (error) {
            console.error("odontologistRepositoryImpl.getActiveByClinic error:", error);
            throw error.response?.data || error;
        }
    },
};
