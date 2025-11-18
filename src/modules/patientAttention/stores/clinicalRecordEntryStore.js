import { defineStore } from 'pinia';
import { clinicalRecordEntryRepositoryImpl } from '../data/repositories/clinicalRecordEntryRepositoryImpl.js';

export const useClinicalRecordEntryStore = defineStore('clinicalRecordEntry', {
    state: () => ({
        entries: [],
        currentEntry: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchByClinicalRecordId(clinicalRecordId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.entries = await clinicalRecordEntryRepositoryImpl.getAllByClinicalRecordId(clinicalRecordId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar entradas clínicas';
                console.error('Error en fetchByClinicalRecordId:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchById(clinicalRecordEntryId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.currentEntry = await clinicalRecordEntryRepositoryImpl.getById(clinicalRecordEntryId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar entrada clínica';
                console.error('Error en fetchById:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async updateEntry(clinicalRecordEntryId, data) {
            try {
                this.isLoading = true;
                this.error = null;
                const updated = await clinicalRecordEntryRepositoryImpl.update(clinicalRecordEntryId, data);
                this.currentEntry = updated;
                
                const index = this.entries.findIndex(e => e.id === clinicalRecordEntryId);
                if (index !== -1) {
                    this.entries[index] = updated;
                }
                
                return updated;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al actualizar entrada clínica';
                console.error('Error en updateEntry:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },

        clearCurrent() {
            this.currentEntry = null;
            this.error = null;
        },

        clearAll() {
            this.entries = [];
            this.currentEntry = null;
            this.error = null;
        },
    },
});
