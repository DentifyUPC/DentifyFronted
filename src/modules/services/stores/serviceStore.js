import { defineStore } from 'pinia';
import { servicesRepositoryImpl } from '../data/repositories/serviceRepositoryImpl.js';

export const serviceStore = defineStore('services', {
    state: () => ({
        services: [],
        filtered: [],
        isLoading: false,
        error: null,
        query: '',
    }),

    getters: {
        count: (state) => state.services.length,
    },

    actions: {
        async fetchAll() {
            try {
                this.isLoading = true;
                this.error = null;
                const services = await servicesRepositoryImpl.getAll();
                this.services = services;
                this.applyFilter();
            } catch (err) {
                this.error = err.response?.data || err.message || String(err);
                console.error('❌ Error en fetchAll services store:', err);
            } finally {
                this.isLoading = false;
            }
        },

        setQuery(q) {
            this.query = q ?? '';
            this.applyFilter();
        },

        applyFilter() {
            if (!this.query || this.query.trim() === '') {
                this.filtered = [...this.services];
                return;
            }
            const q = this.query.trim().toLowerCase();
            this.filtered = this.services.filter((s) =>
                s.name.toLowerCase().includes(q)
            );
        },
    },
});
