import { defineStore } from 'pinia';
import { clinicalRecordRepositoryImpl } from '../data/repositories/clinicalRecordRepositoryImpl.js';

export const useClinicalRecordStore = defineStore('clinicalRecord', {
    state: () => ({
        currentClinicalRecord: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchByPatientId(patientId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.currentClinicalRecord = await clinicalRecordRepositoryImpl.getByPatientId(patientId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar historial clínico';
                console.error('Error en fetchByPatientId:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },

        clearCurrent() {
            this.currentClinicalRecord = null;
            this.error = null;
        },
    },
});
