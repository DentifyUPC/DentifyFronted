import { defineStore } from 'pinia';
import { ref } from 'vue';
import { appointmentRepositoryImpl } from '@/modules/appointment/data/repositories/appointmentRepositoryImpl.js';

export const useAppointmentStore = defineStore('appointment', () => {
    const appointments = ref([]);
    const selectedAppointment = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchByPatientId = async (patientId) => {
        isLoading.value = true;
        error.value = null;
        try {
            appointments.value = await appointmentRepositoryImpl.getByPatientId(patientId);
            return appointments.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar citas del paciente';
            console.error('fetchByPatientId error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchByOdontologistId = async (odontologistId) => {
        isLoading.value = true;
        error.value = null;
        try {
            appointments.value = await appointmentRepositoryImpl.getByOdontologistId(odontologistId);
            return appointments.value;
        } catch (err) {
            error.value = err.message || 'Error al cargar citas del odontologo';
            console.error('fetchByOdontologistId error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const createAppointment = async (payload) => {
        isLoading.value = true;
        error.value = null;
        try {
            const newAppointment = await appointmentRepositoryImpl.create(payload);
            appointments.value.push(newAppointment);
            return newAppointment;
        } catch (err) {
            error.value = err.message || 'Error al crear cita';
            console.error('createAppointment error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const updateAppointment = async (appointmentId, payload) => {
        isLoading.value = true;
        error.value = null;
        try {
            const updatedAppointment = await appointmentRepositoryImpl.update(appointmentId, payload);
            const index = appointments.value.findIndex(a => a.id === appointmentId);
            if (index !== -1) {
                appointments.value[index] = updatedAppointment;
            }
            return updatedAppointment;
        } catch (err) {
            error.value = err.message || 'Error al actualizar cita';
            console.error('updateAppointment error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const selectAppointment = (appointment) => {
        selectedAppointment.value = appointment;
    };

    const clearAppointments = () => {
        appointments.value = [];
        selectedAppointment.value = null;
        error.value = null;
    };

    const getPendingAppointments = () => {
        return appointments.value.filter(apt => apt.isPending);
    };

    const getAssistedAppointments = () => {
        return appointments.value.filter(apt => apt.isAssisted);
    };

    const getAbsentAppointments = () => {
        return appointments.value.filter(apt => apt.isAbsent);
    };

    return {
        appointments,
        selectedAppointment,
        isLoading,
        error,
        fetchByPatientId,
        fetchByOdontologistId,
        createAppointment,
        updateAppointment,
        selectAppointment,
        clearAppointments,
        getPendingAppointments,
        getAssistedAppointments,
        getAbsentAppointments,
    };
});