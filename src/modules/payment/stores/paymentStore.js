import { defineStore } from 'pinia';
import { ref } from 'vue';
import { paymentRepositoryImpl } from '@/modules/payment/data/repositories/paymentRepositoryImpl.js';

export const usePaymentStore = defineStore('payment', () => {
    const payments = ref([]);
    const selectedPayment = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchAll = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            payments.value = await paymentRepositoryImpl.getAll();
            return payments.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar pagos';
            console.error('fetchAll error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchById = async (id) => {
        isLoading.value = true;
        error.value = null;
        try {
            const payment = await paymentRepositoryImpl.getById(id);
            selectedPayment.value = payment;
            return payment;
        } catch (err) {
            error.value = err.message || 'Error al cargar pago';
            console.error('fetchById error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchByAppointmentId = async (appointmentId) => {
        isLoading.value = true;
        error.value = null;
        try {
            const payment = await paymentRepositoryImpl.getByAppointmentId(appointmentId);
            selectedPayment.value = payment;
            return payment;
        } catch (err) {
            error.value = err.message || 'Error al cargar pago de la cita';
            console.error('fetchByAppointmentId error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchByPatientId = async (patientId) => {
        isLoading.value = true;
        error.value = null;
        try {
            payments.value = await paymentRepositoryImpl.getByPatientId(patientId);
            return payments.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar pagos del paciente';
            console.error('fetchByPatientId error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const updateAmount = async (id, amount) => {
        isLoading.value = true;
        error.value = null;
        try {
            const updatedPayment = await paymentRepositoryImpl.updateAmount(id, amount);

            // Update in list if exists
            const index = payments.value.findIndex(p => p.id === id);
            if (index !== -1) {
                payments.value[index] = updatedPayment;
            }

            // Update selected if it's the same
            if (selectedPayment.value?.id === id) {
                selectedPayment.value = updatedPayment;
            }

            return updatedPayment;
        } catch (err) {
            error.value = err.message || 'Error al actualizar monto';
            console.error('updateAmount error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const createPayPalOrder = async (paymentId) => {
        isLoading.value = true;
        error.value = null;
        try {
            const orderData = await paymentRepositoryImpl.createPayPalOrder(paymentId);
            return orderData; // { orderId, status, approvalUrl }
        } catch (err) {
            error.value = err.message || 'Error al crear orden de PayPal';
            console.error('createPayPalOrder error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const capturePayPalOrder = async (paymentId, orderId) => {
        isLoading.value = true;
        error.value = null;
        try {
            const capturedPayment = await paymentRepositoryImpl.capturePayPalOrder(paymentId, orderId);

            // Update in list
            const index = payments.value.findIndex(p => p.id === paymentId);
            if (index !== -1) {
                payments.value[index] = capturedPayment;
            }

            // Update selected
            if (selectedPayment.value?.id === paymentId) {
                selectedPayment.value = capturedPayment;
            }

            return capturedPayment;
        } catch (err) {
            error.value = err.message || 'Error al capturar pago de PayPal';
            console.error('capturePayPalOrder error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const selectPayment = (payment) => {
        selectedPayment.value = payment;
    };

    const clearPayments = () => {
        payments.value = [];
        selectedPayment.value = null;
        error.value = null;
    };

    const getPendingPayments = () => {
        return payments.value.filter(p => p.isPending);
    };

    const getPaidPayments = () => {
        return payments.value.filter(p => p.isPaid);
    };

    const getCancelledPayments = () => {
        return payments.value.filter(p => p.isCancelled);
    };

    return {
        payments,
        selectedPayment,
        isLoading,
        error,
        fetchAll,
        fetchById,
        fetchByAppointmentId,
        fetchByPatientId,
        updateAmount,
        createPayPalOrder,
        capturePayPalOrder,
        selectPayment,
        clearPayments,
        getPendingPayments,
        getPaidPayments,
        getCancelledPayments,
    };
});