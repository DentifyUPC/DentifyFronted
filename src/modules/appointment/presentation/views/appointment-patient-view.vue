
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
          <div class="flex flex-col flex-grow">
            <span class="text-sm text-gray-500">{{ apt.appointmentDate }}</span>
            <span class="text-lg font-semibold text-gray-800">
              {{ apt.shiftName }} — {{ apt.startTime }} a {{ apt.endTime }}
            </span>
            <span class="text-sm text-gray-600 mt-1">
              Odontólogo: Dr. {{ apt.odontologistFirstName }} {{ apt.odontologistLastName }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <button
              v-if="apt.isCompleted"
              @click="openPrescriptionModal(apt.id)"
              class="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-1"
            >
              <i class="pi pi-file-pdf text-sm"></i>
              <span>Ver Receta</span>
            </button>
            <span
                class="px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap"
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
    </div>

    <CreateAppointmentPatientComponent
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handleAppointmentCreated"
    />

    <GetPrescriptionComponent
        v-if="showPrescriptionModal && selectedAppointmentId"
        :appointment-id="selectedAppointmentId"
        @close="closePrescriptionModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { appointmentRepositoryImpl } from '@/modules/appointment/data/repositories/appointmentRepositoryImpl.js';
import { patientApi } from '@/modules/patientAttention/data/datasource/patientApi.js';
import CreateAppointmentPatientComponent from '@/modules/appointment/presentation/components/create-appointment-patient-component.vue';
import GetPrescriptionComponent from '@/modules/patientAttention/presentation/components/get-prescription-component.vue';

const authStore = useAuthStore();
const showCreateModal = ref(false);
const showPrescriptionModal = ref(false);
const isLoading = ref(true);
const error = ref(null);
const appointments = ref([]);
const patientId = ref(null);
const selectedAppointmentId = ref(null);

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
    const appts = response.data || response;
    
    appointments.value = appts.map(apt => ({
      ...apt,
      isCompleted: apt.state === 'COMPLETED' || apt.state === 'completed',
      isPending: apt.state === 'PENDING' || apt.state === 'pending',
      isCancelled: apt.state === 'CANCELLED' || apt.state === 'cancelled',
      stateLabel: 
        apt.state === 'COMPLETED' ? 'Completada' :
        apt.state === 'PENDING' ? 'Pendiente' :
        apt.state === 'CANCELLED' ? 'Cancelada' :
        apt.state
    }));
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

const openPrescriptionModal = (appointmentId) => {
  selectedAppointmentId.value = appointmentId;
  showPrescriptionModal.value = true;
};

const closePrescriptionModal = () => {
  showPrescriptionModal.value = false;
  selectedAppointmentId.value = null;
};
</script>
