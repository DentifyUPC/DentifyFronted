import {defineStore} from 'pinia';
import {toothStatusRepositoryImpl} from '../data/repositories/toothStatusRepositoryImpl.js';

export const useToothStatusStore = defineStore('toothStatus', {
    state: () => ({
        toothStatuses: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        count: (state) => state.toothStatuses.length,
        hasData: (state) => state.toothStatuses.length > 0,
    },

    actions: {
        async fetchAll() {
            try {
                this.isLoading = true;
                this.error = null;
                this.toothStatuses = await toothStatusRepositoryImpl.getAll();
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar estados dentales';
                console.error('❌ Error en fetchAll tooth statuses:', err);
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },
    },
});
