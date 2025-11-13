import { defineStore } from 'pinia';
import { servicePerClinicRepositoryImpl } from '../data/repositories/servicePerClinicRepositoryImpl.js';

export const useServicePerClinicStore = defineStore('servicePerClinic', {
    state: () => ({
        isLoading: false,
        error: null,
        success: false,
        services: [],
    }),

    actions: {
        async createServicePerClinic({ clinicId, serviceId, totalLaborPrice }) {
            try {
                this.isLoading = true;
                this.error = null;
                const res = await servicePerClinicRepositoryImpl.create({
                    clinicId,
                    serviceId,
                    totalLaborPrice,
                });
                this.services.push(res);
                this.success = true;
                return res;
            } catch (err) {
                this.error = err.response?.data || err.message || String(err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async updateServicePerClinic(id, totalLaborPrice) {
            try {
                this.isLoading = true;
                this.error = null;
                const updated = await servicePerClinicRepositoryImpl.update(id, totalLaborPrice);
                this.services = this.services.map(s =>
                    s.id === id ? updated : s
                );
                return updated;
            } catch (err) {
                this.error = err.response?.data || err.message || String(err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchServicesByClinic(clinicId) {
            try {
                this.isLoading = true;
                this.error = null;
                const services = await servicePerClinicRepositoryImpl.getAllByClinic(clinicId);
                this.services = services;
                return services;
            } catch (err) {
                this.error = err.response?.data || err.message || String(err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
    },
});
