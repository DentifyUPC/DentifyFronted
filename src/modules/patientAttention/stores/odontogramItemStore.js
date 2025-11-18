import { defineStore } from 'pinia';
import { odontogramItemRepositoryImpl } from '../data/repositories/odontogramItemRepositoryImpl.js';

export const useOdontogramItemStore = defineStore('odontogramItem', {
    state: () => ({
        items: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchByOdontogramId(odontogramId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.items = await odontogramItemRepositoryImpl.getAllByOdontogramId(odontogramId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar items del odontograma';
                console.error('Error en fetchByOdontogramId:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async updateItem(odontogramItemId, data) {
            try {
                this.isLoading = true;
                this.error = null;
                const updated = await odontogramItemRepositoryImpl.update(odontogramItemId, data);
                
                const index = this.items.findIndex(item => item.id === odontogramItemId);
                if (index !== -1) {
                    this.items[index] = updated;
                }
                
                return updated;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al actualizar item del odontograma';
                console.error('Error en updateItem:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },

        clearAll() {
            this.items = [];
            this.error = null;
        },
    },
});
