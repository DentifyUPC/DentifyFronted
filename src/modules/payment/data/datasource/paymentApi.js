import BaseService from "@/shared/services/baseService.js";

class PaymentApi extends BaseService {
    constructor() {
        super("/payment-service/api/v1/payments");
    }

    async getAll() {
        return await this.get("");
    }

    async getById(id) {
        return await this.get(`/${id}`);
    }

    async getByAppointmentId(appointmentId) {
        return await this.get(`/appointment/${appointmentId}`);
    }

    async getByPatientId(patientId) {
        return await this.get(`/patient/${patientId}`);
    }

    async updateAmount(id, amount) {
        return await this.put(`/${id}/amount`, { amount });
    }

    // PayPal endpoints
    async createPayPalOrder(paymentId) {
        return await this.post("/paypal/create-order", { paymentId });
    }

    async capturePayPalOrder(paymentId, orderId) {
        return await this.post("/paypal/capture-order", {
            paymentId,
            orderId
        });
    }
}

export const paymentApi = new PaymentApi();