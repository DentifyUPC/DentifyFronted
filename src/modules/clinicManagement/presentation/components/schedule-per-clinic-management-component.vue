<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="modal-content relative">
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h1 class="text-2xl font-semibold text-[#2B6D8C] mb-6 text-center">
        Horario de la Clinica
      </h1>

      <div v-if="isLoading" class="flex items-center justify-center py-10">
        <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
        <span class="ml-3 text-gray-600">Cargando horario...</span>
      </div>

      <div v-else-if="schedule" class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p class="text-sm text-gray-500">Hora de Inicio</p>
              <p class="text-lg font-semibold">{{ schedule.formattedStartTime }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Hora de Cierre</p>
              <p class="text-lg font-semibold">{{ schedule.formattedEndTime }}</p>
            </div>
          </div>
          <div class="mt-3 text-sm text-gray-600">
            <p><strong>Duracion:</strong> {{ schedule.duration }}</p>
          </div>
        </div>

        <button
            @click="openUpdateModal"
            class="w-full bg-[#aacff3] text-black px-4 py-2 rounded-lg hover:bg-[#8fc5f0] transition font-medium"
        >
          Actualizar Horario
        </button>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-gray-600 mb-4">No hay horario configurado para esta clinica</p>
        <button
            @click="openCreateModal"
            class="bg-[#aacff3] text-black px-6 py-2 rounded-lg hover:bg-[#8fc5f0] transition font-medium"
        >
          Crear Horario
        </button>
      </div>
    </div>

    <CreateSchedulePerClinicComponent
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handleScheduleCreated"
    />

    <UpdateSchedulePerClinicComponent
        v-if="showUpdateModal"
        :schedule="schedule"
        @close="showUpdateModal = false"
        @updated="handleScheduleUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { schedulePerClinicRepositoryImpl } from '@/modules/clinicManagement/data/repositories/schedulePerClinicRepositoryImpl.js';
import CreateSchedulePerClinicComponent from './create-schedule-per-clinic-component.vue';
import UpdateSchedulePerClinicComponent from './update-schedule-per-clinic-component.vue';

const authStore = useAuthStore();
const clinicId = authStore.user?.clinicId;

const schedule = ref(null);
const isLoading = ref(true);
const showCreateModal = ref(false);
const showUpdateModal = ref(false);

onMounted(async () => {
  try {
    schedule.value = await schedulePerClinicRepositoryImpl.getByClinicId(clinicId);
  } finally {
    isLoading.value = false;
  }
});

const openCreateModal = () => {
  showCreateModal.value = true;
};

const openUpdateModal = () => {
  showUpdateModal.value = true;
};

const handleScheduleCreated = (newSchedule) => {
  schedule.value = newSchedule;
  showCreateModal.value = false;
};

const handleScheduleUpdated = (updatedSchedule) => {
  schedule.value = updatedSchedule;
  showUpdateModal.value = false;
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-w: 600px;
  padding: 2rem;
  animation: fadeInUp 0.25s ease-out;
  max-height: 85vh;
  overflow-y: auto;
}

.fixed {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  animation: fadeOverlay 0.25s ease-out;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 650px;
  padding: 2rem;
  animation: fadeInUp 0.3s ease-out;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #111827;
}

@keyframes fadeOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>