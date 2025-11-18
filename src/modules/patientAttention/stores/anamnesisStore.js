import { defineStore } from 'pinia';
import { anamnesisRepositoryImpl } from '../data/repositories/anamnesisRepositoryImpl.js';

export const useAnamnesisStore = defineStore('anamnesis', {
    state: () => ({
        currentAnamnesis: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchAnamnesis(anamnesisId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.currentAnamnesis = await anamnesisRepositoryImpl.getById(anamnesisId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar anamnesis';
                console.error('Error en fetchAnamnesis:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async updateAnamnesis(anamnesisId, data) {
            try {
                this.isLoading = true;
                this.error = null;
                const updated = await anamnesisRepositoryImpl.update(anamnesisId, data);
                this.currentAnamnesis = updated;
                return updated;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al actualizar anamnesis';
                console.error('Error en updateAnamnesis:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },

        clearCurrent() {
            this.currentAnamnesis = null;
            this.error = null;
        },
    },
});
