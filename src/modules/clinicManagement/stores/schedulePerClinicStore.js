import { defineStore } from 'pinia';
import { ref } from 'vue';
import { schedulePerClinicRepositoryImpl } from '@/modules/clinicManagement/data/repositories/schedulePerClinicRepositoryImpl.js';

export const useSchedulePerClinicStore = defineStore('schedulePerClinic', () => {
    const schedule = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchScheduleByClinicId = async (clinicId) => {
        isLoading.value = true;
        error.value = null;
        try {
            schedule.value = await schedulePerClinicRepositoryImpl.getByClinicId(clinicId);
            return schedule.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar horario';
            console.error('fetchScheduleByClinicId error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const createSchedule = async (payload) => {
        isLoading.value = true;
        error.value = null;
        try {
            schedule.value = await schedulePerClinicRepositoryImpl.create(payload);
            return schedule.value;
        } catch (err) {
            error.value = err.message || 'Error al crear horario';
            console.error('createSchedule error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const updateSchedule = async (clinicId, payload) => {
        isLoading.value = true;
        error.value = null;
        try {
            schedule.value = await schedulePerClinicRepositoryImpl.update(clinicId, payload);
            return schedule.value;
        } catch (err) {
            error.value = err.message || 'Error al actualizar horario';
            console.error('updateSchedule error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const clearSchedule = () => {
        schedule.value = null;
        error.value = null;
    };

    return {
        schedule,
        isLoading,
        error,
        fetchScheduleByClinicId,
        createSchedule,
        updateSchedule,
        clearSchedule,
    };
});