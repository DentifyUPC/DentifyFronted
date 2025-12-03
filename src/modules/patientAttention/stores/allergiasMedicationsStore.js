import { defineStore } from 'pinia';
import { allergiasMedicationsRepositoryImpl } from '../data/repositories/allergiasMedicationsRepositoryImpl.js';

export const useAllergiasMedicationsStore = defineStore('allergiasMedications', {
    state: () => ({
        allergies: [],
        currentAllergy: null,
        isLoading: false,
        error: null,
    }),

    getters: {
        hasAllergies: (state) => state.allergies.length > 0,
        allergyCount: (state) => state.allergies.length,
    },

    actions: {
        async fetchByClinicalRecordId(clinicalRecordId) {
            try {
                this.isLoading = true;
                this.error = null;
                this.allergies = await allergiasMedicationsRepositoryImpl.getByClinicalRecordId(clinicalRecordId);
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al cargar alergias';
                console.error('Error en fetchByClinicalRecordId:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async create(data) {
            try {
                this.isLoading = true;
                this.error = null;
                const newAllergy = await allergiasMedicationsRepositoryImpl.create(data);
                this.allergies.push(newAllergy);
                this.currentAllergy = newAllergy;
                return newAllergy;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al crear alergia';
                console.error('Error en create:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async update(allergiaMedicationId, data) {
            try {
                this.isLoading = true;
                this.error = null;
                const updated = await allergiasMedicationsRepositoryImpl.update(allergiaMedicationId, data);
                
                const index = this.allergies.findIndex(a => a.id === allergiaMedicationId);
                if (index !== -1) {
                    this.allergies[index] = updated;
                }
                
                this.currentAllergy = updated;
                return updated;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al actualizar alergia';
                console.error('Error en update:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async delete(allergiaMedicationId) {
            try {
                this.isLoading = true;
                this.error = null;
                await allergiasMedicationsRepositoryImpl.delete(allergiaMedicationId);
                
                this.allergies = this.allergies.filter(a => a.id !== allergiaMedicationId);
                
                if (this.currentAllergy?.id === allergiaMedicationId) {
                    this.currentAllergy = null;
                }
                
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Error al eliminar alergia';
                console.error('Error en delete:', err);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        clearError() {
            this.error = null;
        },

        clearAllergies() {
            this.allergies = [];
            this.currentAllergy = null;
            this.error = null;
        },
    },
});
