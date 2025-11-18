import { defineStore } from 'pinia';
import { prescriptionRepositoryImpl } from '../data/repositories/prescriptionRepositoryImpl.js';

export const usePrescriptionStore = defineStore('prescription', {
    state: () => ({
        currentPrescription: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchPrescription(prescriptionId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.currentPrescription = await prescriptionRepositoryImpl.getById(prescriptionId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar prescripción';
                console.error('Error en fetchPrescription:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async updatePrescription(prescriptionId, data) {
            try {
                this.isLoading = true;
                this.error = null;
                const updated = await prescriptionRepositoryImpl.update(prescriptionId, data);
                this.currentPrescription = updated;
                return updated;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al actualizar prescripción';
                console.error('Error en updatePrescription:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },

        clearCurrent() {
            this.currentPrescription = null;
            this.error = null;
        },
    },
});
