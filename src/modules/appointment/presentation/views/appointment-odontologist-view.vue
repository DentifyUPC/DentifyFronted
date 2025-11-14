<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-[#2B6D8C] mb-8">Mis Citas Programadas</h1>

      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
        <span class="ml-3 text-gray-600">Cargando citas...</span>
      </div>

      <div v-else-if="error" class="text-red-500 text-lg text-center py-10">
        Error al cargar citas: {{ error }}
      </div>

      <div v-else-if="appointments.length === 0" class="text-center py-16">
        <i class="pi pi-calendar text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No tienes citas programadas</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#AACFF3] text-[#2B6D8C]">
            <tr>
              <th class="py-3 px-4 text-left">Fecha</th>
              <th class="py-3 px-4 text-left">Horario</th>
              <th class="py-3 px-4 text-left">Turno</th>
              <th class="py-3 px-4 text-left">Paciente</th>
              <th class="py-3 px-4 text-left">Estado</th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="apt in appointments"
                :key="apt.id"
                class="border-b hover:bg-gray-50 transition"
            >
              <td class="py-3 px-4 font-medium text-gray-800">{{ apt.formattedDate }}</td>
              <td class="py-3 px-4 text-gray-600">{{ apt.timeRange }}</td>
              <td class="py-3 px-4 text-gray-600">{{ apt.shiftName }}</td>


              <td class="py-3 px-4 text-gray-600">{{ apt.patientFullName }}</td>

              <td class="py-3 px-4">
                  <span
                      class="px-3 py-1 rounded-full text-xs font-medium"
                      :class="{
                      'bg-yellow-100 text-yellow-700': apt.isPending,
                      'bg-green-100 text-green-700': apt.isCompleted,
                      'bg-red-100 text-red-700': apt.isCancelled
                    }"
                  >
                    {{ apt.stateLabel }}
                  </span>
              </td>

              <td class="py-3 px-4 text-center">
                <button
                    @click="openUpdateModal(apt)"
                    class="bg-[#2B6D8C] text-white px-4 py-1 rounded-lg hover:bg-[#1E4F67] transition text-sm"
                >
                  Actualizar
                </button>
              </td>
            </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>

    <UpdateAppointmentOdontologistComponent
        v-if="showUpdateModal"
        :appointment="selectedAppointment"
        @close="showUpdateModal = false"
        @updated="handleAppointmentUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { useAppointmentStore } from '@/modules/appointment/stores/appointmentStore.js';
import { odontologistRepositoryImpl } from '@/modules/practiceManagement/data/repositories/odontologistRepositoryImpl.js';
import UpdateAppointmentOdontologistComponent from '@/modules/appointment/presentation/components/update-appointment-odontologist-component.vue';

const authStore = useAuthStore();
const appointmentStore = useAppointmentStore();

const showUpdateModal = ref(false);
const selectedAppointment = ref(null);
const isLoading = ref(true);
const error = ref(null);
const odontologistId = ref(null);

const appointments = computed(() => appointmentStore.appointments);

onMounted(async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      error.value = 'No se encontró información del usuario';
      isLoading.value = false;
      return;
    }

    const odontologist = await odontologistRepositoryImpl.getProfile(userId);
    odontologistId.value = odontologist.id;

    await appointmentStore.fetchByOdontologistId(odontologistId.value);

  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
});

const openUpdateModal = (apt) => {
  selectedAppointment.value = apt;
  showUpdateModal.value = true;
};

const handleAppointmentUpdated = async () => {
  showUpdateModal.value = false;
  await appointmentStore.fetchByOdontologistId(odontologistId.value);
};
</script>
