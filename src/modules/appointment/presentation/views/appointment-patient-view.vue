<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 border border-gray-100">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-[#2B6D8C]">Mis Citas</h1>
        <button
            @click="showCreateModal = true"
            class="bg-[#2B6D8C] hover:bg-[#1E4F67] text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Agendar Nueva Cita
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20 text-[#2B6D8C]">
        <i class="pi pi-spin pi-spinner text-3xl"></i>
        <span class="ml-3 text-gray-600">Cargando citas...</span>
      </div>

      <div v-else-if="error" class="text-red-500 text-center text-lg py-10">
        {{ error }}
      </div>

      <div v-else-if="appointments.length === 0" class="text-center py-16">
        <p class="text-gray-500 text-lg mb-6">No tienes citas agendadas</p>
        <button
            @click="showCreateModal = true"
            class="bg-[#2B6D8C] hover:bg-[#1E4F67] text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        >
          Agendar tu primera cita
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
            v-for="apt in appointments"
            :key="apt.id"
            class="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-xl p-5 border border-gray-200"
        >
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">{{ apt.formattedDate }}</span>
            <span class="text-lg font-semibold text-gray-800">
              {{ apt.shiftName }} — {{ apt.timeRange }}
            </span>
            <span class="text-sm text-gray-600 mt-1">
              Duración: {{ apt.duration }} | Odontólogo: Dr. #{{ apt.odontologistId }}
            </span>
          </div>
          <span
              class="px-4 py-1 rounded-full text-sm font-medium"
              :class="{
              'bg-yellow-100 text-yellow-700': apt.isPending,
              'bg-green-100 text-green-700': apt.isCompleted,
              'bg-red-100 text-red-700': apt.isCancelled
            }"
          >
            {{ apt.stateLabel }}
          </span>
        </div>
      </div>
    </div>

    <CreateAppointmentPatientComponent
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handleAppointmentCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { appointmentRepositoryImpl } from '@/modules/appointment/data/repositories/appointmentRepositoryImpl.js';
import { patientApi } from '@/modules/patientAttention/data/datasource/patientApi.js';
import CreateAppointmentPatientComponent from '@/modules/appointment/presentation/components/create-appointment-patient-component.vue';

const authStore = useAuthStore();
const showCreateModal = ref(false);
const isLoading = ref(true);
const error = ref(null);
const appointments = ref([]);
const patientId = ref(null);

const loadAppointments = async () => {
  isLoading.value = true;
  try {
    const user = authStore.user;
    if (!user) throw new Error("Usuario no autenticado.");

    const patientResponse = await patientApi.getByUserId(user.id);
    const patient = patientResponse.data || patientResponse;
    if (!patient?.id) throw new Error("No se encontró el paciente.");

    patientId.value = patient.id;
    const response = await appointmentRepositoryImpl.getByPatientId(patient.id);
    appointments.value = response.data || response;
  } catch (err) {
    error.value = "No se pudieron obtener las citas del paciente.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadAppointments();
});

const handleAppointmentCreated = async () => {
  showCreateModal.value = false;
  await loadAppointments();
};
</script>
