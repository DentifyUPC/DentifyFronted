import { defineStore } from 'pinia';
import { ref } from 'vue';
import { odontologistRepositoryImpl } from '@/modules/practiceManagement/data/repositories/odontologistRepositoryImpl.js';

export const useOdontologistStore = defineStore('odontologist', () => {
    const odontologists = ref([]);
    const selectedOdontologist = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchAllByClinic = async (clinicId) => {
        isLoading.value = true;
        error.value = null;
        try {
            odontologists.value = await odontologistRepositoryImpl.getAllByClinic(clinicId);
            return odontologists.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar odontólogos';
            console.error('fetchAllByClinic error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchActiveByClinic = async (clinicId) => {
        isLoading.value = true;
        error.value = null;
        try {
            odontologists.value = await odontologistRepositoryImpl.getActiveByClinic(clinicId);
            return odontologists.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar odontólogos activos';
            console.error('fetchActiveByClinic error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchById = async (odontologistId) => {
        isLoading.value = true;
        error.value = null;
        try {
            const odontologist = await odontologistRepositoryImpl.getById(odontologistId);
            selectedOdontologist.value = odontologist;
            return odontologist;
        } catch (err) {
            error.value = err.message || 'Error al cargar odontólogo';
            console.error('fetchById error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const selectOdontologist = (odontologist) => {
        selectedOdontologist.value = odontologist;
    };

    const clearOdontologists = () => {
        odontologists.value = [];
        selectedOdontologist.value = null;
        error.value = null;
    };

    const getActiveOdontologists = () => {
        return odontologists.value.filter(o => o.isActive);
    };

    return {
        odontologists,
        selectedOdontologist,
        isLoading,
        error,
        fetchAllByClinic,
        fetchActiveByClinic,
        fetchById,
        selectOdontologist,
        clearOdontologists,
        getActiveOdontologists,
    };
});
