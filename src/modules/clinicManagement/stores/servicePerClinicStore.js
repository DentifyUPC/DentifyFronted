import { defineStore } from 'pinia';
import { servicePerClinicRepositoryImpl } from '../data/repositories/servicePerClinicRepositoryImpl.js';
import {ServicePerClinicMapper} from "@/modules/clinicManagement/data/mappers/servicePerClinicMapper.js";
import {servicePerClinicApi} from "@/modules/clinicManagement/data/datasource/servicePerClinicApi.js";

export const useServicePerClinicStore = defineStore('servicePerClinic', {
    state: () => ({
        isLoading: false,
        error: null,
        success: false,
    }),

    actions: {
        async createServicePerClinic({ clinicId, serviceId, totalLaborPrice }) {
            try {
                this.isLoading = true;
                this.error = null;
                this.success = false;
                const res = await servicePerClinicRepositoryImpl.create({
                    clinicId,
                    serviceId,
                    totalLaborPrice,
                });
                this.success = true;
                return res;
            } catch (err) {
                this.error = err.response?.data || err.message || String(err);
                console.error('❌ Error al crear service-per-clinic:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },


    },
});
