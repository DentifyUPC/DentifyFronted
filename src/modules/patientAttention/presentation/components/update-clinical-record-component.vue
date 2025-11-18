<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-10"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-fadeIn"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Editar Entrada Clínica
      </h2>

      <!-- Form -->
      <form @submit.prevent="handleUpdate" class="flex flex-col space-y-6">
        <!-- Evolution -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Evolución *
          </label>
          <textarea
            v-model="form.evolution"
            rows="4"
            placeholder="Describe la evolución del tratamiento y estado actual del paciente..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
            required
          ></textarea>
          <div v-if="errors.evolution" class="text-red-500 text-sm mt-1">
            {{ errors.evolution }}
          </div>
        </div>

        <!-- Observation -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Observación
          </label>
          <textarea
            v-model="form.observation"
            rows="4"
            placeholder="Notas u observaciones adicionales sobre el tratamiento..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="validationError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 flex items-center gap-2 text-sm">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ validationError }}</span>
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-800 flex items-center gap-2 text-sm">
            <i class="pi pi-check-circle"></i>
            <span>{{ successMessage }}</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition flex items-center gap-2"
          >
            <i class="pi pi-times"></i>
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2 text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 rounded-lg font-medium transition flex items-center gap-2"
          >
            <i v-if="!isSubmitting" class="pi pi-check"></i>
            <i v-else class="pi pi-spin pi-spinner"></i>
            <span>{{ isSubmitting ? 'Guardando...' : 'Guardar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { clinicalRecordEntryRepositoryImpl } from '../../data/repositories/clinicalRecordEntryRepositoryImpl.js';

const props = defineProps({
  entry: { type: Object, required: true },
  clinicalRecordId: { type: Number, required: true },
});

const emit = defineEmits(['close', 'updated']);

const form = ref({
  evolution: '',
  observation: '',
});

const isSubmitting = ref(false);
const validationError = ref('');
const successMessage = ref('');
const errors = ref({});

onMounted(() => {
  if (props.entry) {
    form.value = {
      evolution: props.entry.evolution || '',
      observation: props.entry.observation || '',
    };
    console.log('📝 Editing clinical record entry:', props.entry);
  }
});

const handleUpdate = async () => {
  validationError.value = '';
  successMessage.value = '';
  errors.value = {};

  // Validar evolución (requerido)
  if (!form.value.evolution?.trim()) {
    errors.value.evolution = 'La evolución es requerida';
    return;
  }

  isSubmitting.value = true;

  try {
    console.log(`📝 Updating clinical record entry ID: ${props.entry.id}`, form.value);
    
    await clinicalRecordEntryRepositoryImpl.update(props.entry.id, {
      evolution: form.value.evolution.trim(),
      observation: form.value.observation.trim(),
    });

    successMessage.value = '✓ Entrada clínica actualizada correctamente';
    console.log('✓ Clinical record entry updated successfully');

    setTimeout(() => {
      emit('updated');
    }, 1000);
  } catch (error) {
    console.error('Error updating clinical record entry:', error);
    validationError.value = 'Error al guardar: ' + (error.message || 'Intenta nuevamente');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
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
.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  animation: fadeInUp 0.25s ease-out;
}
</style>
