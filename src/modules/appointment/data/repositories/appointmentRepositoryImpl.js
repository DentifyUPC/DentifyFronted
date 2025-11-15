import { appointmentApi } from "../datasource/appointmentApi.js";
import { AppointmentMapper } from "../mappers/appointmentMapper.js";

export const appointmentRepositoryImpl = {
    async getByPatientId(patientId) {
        try {
            const data = await appointmentApi.getByPatientId(patientId);
            return AppointmentMapper.toDomainList(data);
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            console.error("getByPatientId error:", error);
            throw error;
        }
    },

    async getByOdontologistId(odontologistId) {
        try {
            const data = await appointmentApi.getByOdontologistId(odontologistId);
            return AppointmentMapper.toDomainList(data);
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            console.error("getByOdontologistId error:", error);
            throw error;
        }
    },

    async create(payload) {
        try {
            const dto = AppointmentMapper.toCreatePayload(payload);
            const data = await appointmentApi.create(dto);
            return AppointmentMapper.toDomain(data);
        } catch (error) {
            console.error("create error:", error);
            throw error;
        }
    },

    async update(appointmentId, payload) {
        try {
            const dto = AppointmentMapper.toUpdatePayload(payload);
            const data = await appointmentApi.update(appointmentId, dto);
            return AppointmentMapper.toDomain(data);
        } catch (error) {
            console.error("update error:", error);
            throw error;
        }
    },

    async getByClinicAndDate(clinicId, date) {
        try {
            const allAppointments = [];
            return allAppointments.filter(apt =>
                apt.clinicId === clinicId &&
                apt.appointmentDate === date
            );
        } catch (error) {
            console.error("getByClinicAndDate error:", error);
            throw error;
        }
    },
};