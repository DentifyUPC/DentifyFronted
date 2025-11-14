<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
    <div class="modal-content relative">
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-[#2B6D8C] mb-6 text-center">
        Actualizar Horario de Clínica
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Hora de Inicio</label>
          <input
              v-model="form.startTime"
              type="time"
              required
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aacff3]"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Hora de Cierre</label>
          <input
              v-model="form.endTime"
              type="time"
              required
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aacff3]"
          />
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
              type="button"
              @click="$emit('close')"
              class="bg-gray-200 text-black px-5 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              :disabled="isLoading"
              class="bg-[#aacff3] text-black px-5 py-2 rounded-lg hover:bg-[#8fc5f0] transition disabled:opacity-50"
          >
            {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/iam/stores/authStore.js';
import { schedulePerClinicRepositoryImpl } from '@/modules/clinicManagement/data/repositories/schedulePerClinicRepositoryImpl.js';

const props = defineProps({
  schedule: { type: Object, required: true },
});

const emit = defineEmits(['close', 'updated']);
const authStore = useAuthStore();
const clinicId = authStore.user?.clinicId;

const form = ref({
  startTime: '',
  endTime: '',
});

const isLoading = ref(false);

onMounted(() => {
  form.value.startTime = props.schedule.startTime?.slice(0, 5) || '';
  form.value.endTime = props.schedule.endTime?.slice(0, 5) || '';
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const payload = {
      startTime: form.value.startTime.slice(0, 5),
      endTime: form.value.endTime.slice(0, 5),
    };

    const updated = await schedulePerClinicRepositoryImpl.update(clinicId, payload);
    alert('Horario actualizado exitosamente');
    emit('updated', updated);
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    alert(error.response?.data?.error || 'Error al actualizar horario');
  } finally {
    isLoading.value = false;
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