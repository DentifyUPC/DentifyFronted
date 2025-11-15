import { shiftApi } from "../datasource/shiftApi.js";
import { ShiftMapper } from "../mappers/shiftMapper.js";

export const shiftRepositoryImpl = {
    async getAllByClinic(clinicId) {
        try {
            const data = await shiftApi.getAllByClinic(clinicId);
            return ShiftMapper.toDomainList(data);
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            console.error("getAllByClinic error:", error);
            throw error;
        }
    },

    async create(payload) {
        try {
            const dto = ShiftMapper.toCreatePayload(payload);
            const data = await shiftApi.create(dto);
            return ShiftMapper.toDomain(data);
        } catch (error) {
            console.error("create error:", error);
            throw error;
        }
    },

    async update(shiftId, payload) {
        try {
            const dto = ShiftMapper.toUpdatePayload(payload);
            const data = await shiftApi.update(shiftId, dto);
            return ShiftMapper.toDomain(data);
        } catch (error) {
            console.error("update error:", error);
            throw error;
        }
    },

    async delete(shiftId) {
        try {
            await shiftApi.delete(shiftId);
            return true;
        } catch (error) {
            console.error("delete error:", error);
            throw error;
        }
    },

    async getShiftsByNames(clinicId, shiftNames = []) {
        try {
            const allShifts = await this.getAllByClinic(clinicId);
            if (shiftNames.length === 0) return allShifts;
            return allShifts.filter(shift => shiftNames.includes(shift.name));
        } catch (error) {
            console.error("getShiftsByNames error:", error);
            throw error;
        }
    },
};