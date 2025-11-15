import { schedulePerClinicApi } from "../datasource/schedulePerClinicApi.js";
import { SchedulePerClinicMapper } from "../mappers/schedulePerClinicMapper.js";

export const schedulePerClinicRepositoryImpl = {
    async getByClinicId(clinicId) {
        try {
            const data = await schedulePerClinicApi.getByClinicId(clinicId);

            if (!data || Object.keys(data).length === 0) {
                return null;
            }

            return SchedulePerClinicMapper.toDomain(data);
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error("getByClinicId error:", error);
            throw error;
        }
    },


    async create(payload) {
        try {
            const dto = SchedulePerClinicMapper.toCreatePayload(payload);
            const data = await schedulePerClinicApi.create(dto);
            return SchedulePerClinicMapper.toDomain(data);
        } catch (error) {
            console.error("create error:", error);
            throw error;
        }
    },

    async update(clinicId, payload) {
        try {
            const dto = SchedulePerClinicMapper.toUpdatePayload(payload);
            const data = await schedulePerClinicApi.update(clinicId, dto);
            return SchedulePerClinicMapper.toDomain(data);
        } catch (error) {
            console.error("update error:", error);
            throw error;
        }
    },
};