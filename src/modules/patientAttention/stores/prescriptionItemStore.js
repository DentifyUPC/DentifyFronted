import { defineStore } from 'pinia';
import { prescriptionItemRepositoryImpl } from '../data/repositories/prescriptionItemRepositoryImpl.js';

export const usePrescriptionItemStore = defineStore('prescriptionItem', {
    state: () => ({
        items: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        count: (state) => state.items.length,
        hasItems: (state) => state.items.length > 0,
    },

    actions: {
        async fetchItems(prescriptionId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.items = await prescriptionItemRepositoryImpl.getByPrescriptionId(prescriptionId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar medicamentos';
                console.error('Error en fetchItems:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async createItem(data) {
            try {
                this.isLoading = true;
                this.error = null;
                const newItem = await prescriptionItemRepositoryImpl.create(data);
                this.items.push(newItem);
                return newItem;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al crear medicamento';
                console.error('Error en createItem:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async updateItem(prescriptionItemId, data) {
            try {
                this.isLoading = true;
                this.error = null;
                const updated = await prescriptionItemRepositoryImpl.update(prescriptionItemId, data);
                const index = this.items.findIndex((item) => item.id === prescriptionItemId);
                if (index !== -1) {
                    this.items[index] = updated;
                }
                return updated;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al actualizar medicamento';
                console.error('Error en updateItem:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteItem(prescriptionItemId) {
            try {
                this.isLoading = true;
                this.error = null;
                await prescriptionItemRepositoryImpl.delete(prescriptionItemId);
                this.items = this.items.filter((item) => item.id !== prescriptionItemId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al eliminar medicamento';
                console.error('Error en deleteItem:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },

        clearItems() {
            this.items = [];
            this.error = null;
        },
    },
});
