import { paymentApi } from "../datasource/paymentApi.js";
import { PaymentMapper } from "../mappers/paymentMapper.js";

export const paymentRepositoryImpl = {
    async getAll() {
        try {
            const data = await paymentApi.getAll();
            return PaymentMapper.toDomainList(data);
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            console.error("getAll error:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const data = await paymentApi.getById(id);
            return PaymentMapper.toDomain(data);
        } catch (error) {
            console.error("getById error:", error);
            throw error;
        }
    },

    async getByAppointmentId(appointmentId) {
        try {
            const data = await paymentApi.getByAppointmentId(appointmentId);
            return PaymentMapper.toDomain(data);
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error("getByAppointmentId error:", error);
            throw error;
        }
    },

    async getByPatientId(patientId) {
        try {
            const data = await paymentApi.getByPatientId(patientId);
            return PaymentMapper.toDomainList(data);
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            console.error("getByPatientId error:", error);
            throw error;
        }
    },

    async updateAmount(id, amount) {
        try {
            const data = await paymentApi.updateAmount(id, amount);
            return PaymentMapper.toDomain(data);
        } catch (error) {
            console.error("updateAmount error:", error);
            throw error;
        }
    },

    async createPayPalOrder(paymentId) {
        try {
            // Returns: { orderId, status, approvalUrl }
            const data = await paymentApi.createPayPalOrder(paymentId);
            return data;
        } catch (error) {
            console.error("createPayPalOrder error:", error);
            throw error;
        }
    },

    async capturePayPalOrder(paymentId, orderId) {
        try {
            const data = await paymentApi.capturePayPalOrder(paymentId, orderId);
            return PaymentMapper.toDomain(data);
        } catch (error) {
            console.error("capturePayPalOrder error:", error);
            throw error;
        }
    },
};