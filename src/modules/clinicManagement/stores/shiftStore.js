import { defineStore } from 'pinia';
import { ref } from 'vue';
import { shiftRepositoryImpl } from '@/modules/clinicManagement/data/repositories/shiftRepositoryImpl.js';

export const useShiftStore = defineStore('shift', () => {
    const shifts = ref([]);
    const selectedShift = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchShiftsByClinicId = async (clinicId) => {
        isLoading.value = true;
        error.value = null;
        try {
            shifts.value = await shiftRepositoryImpl.getAllByClinic(clinicId);
            return shifts.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar turnos';
            console.error('fetchShiftsByClinicId error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const createShift = async (payload) => {
        isLoading.value = true;
        error.value = null;
        try {
            const newShift = await shiftRepositoryImpl.create(payload);
            shifts.value.push(newShift);
            return newShift;
        } catch (err) {
            error.value = err.message || 'Error al crear turno';
            console.error('createShift error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const updateShift = async (shiftId, payload) => {
        isLoading.value = true;
        error.value = null;
        try {
            const updatedShift = await shiftRepositoryImpl.update(shiftId, payload);
            const index = shifts.value.findIndex(s => s.id === shiftId);
            if (index !== -1) {
                shifts.value[index] = updatedShift;
            }
            return updatedShift;
        } catch (err) {
            error.value = err.message || 'Error al actualizar turno';
            console.error('updateShift error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteShift = async (shiftId) => {
        isLoading.value = true;
        error.value = null;
        try {
            await shiftRepositoryImpl.delete(shiftId);
            shifts.value = shifts.value.filter(s => s.id !== shiftId);
            return true;
        } catch (err) {
            error.value = err.message || 'Error al eliminar turno';
            console.error('deleteShift error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const getShiftsByNames = async (clinicId, shiftNames = []) => {
        try {
            return await shiftRepositoryImpl.getShiftsByNames(clinicId, shiftNames);
        } catch (err) {
            error.value = err.message || 'Error al filtrar turnos';
            console.error('getShiftsByNames error:', err);
            throw err;
        }
    };

    const selectShift = (shift) => {
        selectedShift.value = shift;
    };

    const clearShifts = () => {
        shifts.value = [];
        selectedShift.value = null;
        error.value = null;
    };

    return {
        shifts,
        selectedShift,
        isLoading,
        error,
        fetchShiftsByClinicId,
        createShift,
        updateShift,
        deleteShift,
        getShiftsByNames,
        selectShift,
        clearShifts,
    };
});