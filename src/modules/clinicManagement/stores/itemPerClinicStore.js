import { defineStore } from 'pinia';
import { itemPerClinicRepositoryImpl } from '../data/repositories/itemPerClinicRepositoryImpl.js';

export const useItemPerClinicStore = defineStore('itemPerClinic', {
    state: () => ({
        items: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchAllByClinic(clinicId) {
            this.isLoading = true;
            this.error = null;
            try {
                const list = await itemPerClinicRepositoryImpl.getByClinicId(clinicId);
                this.items = list;
            } catch (err) {
                console.error('❌ Error al obtener items-per-clinic:', err);
                this.error = err.response?.data || err.message || String(err);
            } finally {
                this.isLoading = false;
            }
        },

        async createItem(data) {
            try {
                const newItem = await itemPerClinicRepositoryImpl.create(data);
                this.items.push(newItem);
            } catch (err) {
                console.error('❌ Error creando item-per-clinic:', err);
                throw err;
            }
        },

        async updateItem(id, data) {
            try {
                const updated = await itemPerClinicRepositoryImpl.update(id, data);
                const idx = this.items.findIndex((i) => i.id === id);
                if (idx !== -1) this.items[idx] = updated;
            } catch (err) {
                console.error('❌ Error actualizando item-per-clinic:', err);
                throw err;
            }
        },
    },
});
