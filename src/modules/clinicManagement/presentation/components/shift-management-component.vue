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
        Turnos de la Clinica
      </h1>

      <div v-if="isLoading" class="flex items-center justify-center py-10">
        <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
        <span class="ml-3 text-gray-600">Cargando turnos...</span>
      </div>

      <div v-else>


        <div v-if="shifts.length === 0" class="text-center text-gray-600 py-8">
          No hay turnos configurados
        </div>

        <div v-else class="divide-y divide-gray-200 border border-gray-100 rounded-lg">
          <div
              v-for="shift in shifts"
              :key="shift.id"
              class="flex items-center justify-between p-4 hover:bg-gray-50 transition"
          >
            <div>
              <p class="font-semibold text-gray-800">{{ shift.displayName }}</p>
              <p class="text-sm text-gray-500">{{ shift.timeRange }}</p>
            </div>
            <div class="flex gap-2">
              <button
                  @click="openUpdateModal(shift)"
                  class="text-sm px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-100 transition"
              >
                Editar
              </button>
              <button
                  @click="handleDelete(shift.id)"
                  class="text-sm px-3 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <button
              @click="openCreateModal"
              class="w-full bg-[#aacff3] text-black px-4 py-2 rounded-lg hover:bg-[#8fc5f0] transition font-medium"
          >
            Crear Nuevo Turno
          </button>
        </div>
      </div>
    </div>

    <CreateShiftComponent
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="handleShiftCreated"
    />

    <UpdateShiftComponent
        v-if="showUpdateModal"
        :shift="selectedShift"
        @close="showUpdateModal = false"
        @updated="handleShiftUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { shiftRepositoryImpl } from '@/modules/clinicManagement/data/repositories/shiftRepositoryImpl.js';
import CreateShiftComponent from './create-shift-component.vue';
import UpdateShiftComponent from './update-shift-component.vue';

const authStore = useAuthStore();
const clinicId = authStore.user?.clinicId;

const shifts = ref([]);
const isLoading = ref(true);
const showCreateModal = ref(false);
const showUpdateModal = ref(false);
const selectedShift = ref(null);

onMounted(async () => {
  await loadShifts();
});

const loadShifts = async () => {
  try {
    isLoading.value = true;
    shifts.value = await shiftRepositoryImpl.getAllByClinic(clinicId);
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  showCreateModal.value = true;
};

const openUpdateModal = (shift) => {
  selectedShift.value = shift;
  showUpdateModal.value = true;
};

const handleShiftCreated = (newShift) => {
  shifts.value.push(newShift);
  showCreateModal.value = false;
};

const handleShiftUpdated = (updatedShift) => {
  const index = shifts.value.findIndex(s => s.id === updatedShift.id);
  if (index !== -1) {
    shifts.value[index] = updatedShift;
  }
  showUpdateModal.value = false;
};

const handleDelete = async (shiftId) => {
  if (!confirm('Seguro que deseas eliminar este turno?')) return;

  try {
    await shiftRepositoryImpl.delete(shiftId);
    shifts.value = shifts.value.filter(s => s.id !== shiftId);
    alert('Turno eliminado exitosamente');
  } catch (error) {
    alert(error.response?.data?.error || 'Error al eliminar turno');
  }
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  animation: fadeInUp 0.25s ease-out;
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