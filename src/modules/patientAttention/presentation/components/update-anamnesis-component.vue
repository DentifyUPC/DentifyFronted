<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl mx-4 p-8 animate-fadeIn overflow-y-auto max-h-[90vh] flex flex-col"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Completar Anamnesis
      </h2>

      <form @submit.prevent="handleUpdate" class="flex flex-col flex-grow space-y-5">
        <!-- Antecedentes Clínicos -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Antecedentes Clínicos
          </label>
          <textarea
            v-model="form.clinicalBackground"
            rows="3"
            placeholder="Describe los antecedentes clínicos relevantes..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
            required
          ></textarea>
        </div>

        <!-- Medicamentos Actuales -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Medicamentos Actuales
          </label>
          <textarea
            v-model="form.currentMedications"
            rows="3"
            placeholder="Lista los medicamentos que está tomando actualmente..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
            required
          ></textarea>
        </div>

        <!-- Contacto de Emergencia -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Contacto de Emergencia
          </label>
          <input
            v-model="form.emergencyContact"
            type="tel"
            placeholder="Número de teléfono (9 dígitos)"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            maxlength="9"
            required
          />
          <div v-if="emergencyContactError" class="text-red-500 text-sm mt-1">
            {{ emergencyContactError }}
          </div>
        </div>

        <!-- Condiciones de Salud -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <!-- Presión Baja -->
          <div class="flex items-center space-x-3">
            <input
              v-model="form.lowBloodPressure"
              type="checkbox"
              id="lowBloodPressure"
              class="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
            />
            <label for="lowBloodPressure" class="text-sm font-medium text-gray-700 cursor-pointer">
              Presión Baja
            </label>
          </div>

          <!-- Presión Alta -->
          <div class="flex items-center space-x-3">
            <input
              v-model="form.highBloodPressure"
              type="checkbox"
              id="highBloodPressure"
              class="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
            />
            <label for="highBloodPressure" class="text-sm font-medium text-gray-700 cursor-pointer">
              Presión Alta
            </label>
          </div>

          <!-- Fumador -->
          <div class="flex items-center space-x-3">
            <input
              v-model="form.smoke"
              type="checkbox"
              id="smoke"
              class="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
            />
            <label for="smoke" class="text-sm font-medium text-gray-700 cursor-pointer">
              Fumador
            </label>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-end gap-3 mt-6 pt-6 border-t">
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
import { ref, onMounted, computed } from 'vue';
import { anamnesisRepositoryImpl } from '../../data/repositories/anamnesisRepositoryImpl.js';

const props = defineProps({
  anamnesis: { type: Object, default: null },
  anamnesisId: { type: Number, required: true },
});

const emit = defineEmits(['close', 'updated']);

const form = ref({
  clinicalBackground: '',
  currentMedications: '',
  emergencyContact: '',
  lowBloodPressure: false,
  highBloodPressure: false,
  smoke: false,
});

const isSubmitting = ref(false);
const emergencyContactError = ref('');

const isValidEmergencyContact = computed(() => {
  const contact = form.value.emergencyContact ? form.value.emergencyContact.trim() : '';
  return /^\d{9}$/.test(contact);
});

onMounted(() => {
  if (props.anamnesis) {
    form.value = {
      clinicalBackground: props.anamnesis.clinicalBackground || '',
      currentMedications: props.anamnesis.currentMedications || '',
      emergencyContact: props.anamnesis.emergencyContact || '',
      lowBloodPressure: props.anamnesis.lowBloodPressure || false,
      highBloodPressure: props.anamnesis.highBloodPressure || false,
      smoke: props.anamnesis.smoke || false,
    };
  }
});

const handleUpdate = async () => {
  emergencyContactError.value = '';

  // Validar campos requeridos
  if (!form.value.clinicalBackground?.trim()) {
    emergencyContactError.value = 'Los antecedentes clínicos son requeridos';
    return;
  }

  if (!form.value.currentMedications?.trim()) {
    emergencyContactError.value = 'Los medicamentos actuales son requeridos';
    return;
  }

  if (!isValidEmergencyContact.value) {
    emergencyContactError.value = 'El contacto de emergencia debe contener 9 dígitos';
    return;
  }

  isSubmitting.value = true;

  try {
    const payload = {
      clinicalBackground: form.value.clinicalBackground.trim(),
      currentMedications: form.value.currentMedications.trim(),
      emergencyContact: form.value.emergencyContact.trim(),
      lowBloodPressure: form.value.lowBloodPressure,
      highBloodPressure: form.value.highBloodPressure,
      smoke: form.value.smoke,
    };

    await anamnesisRepositoryImpl.update(props.anamnesisId, payload);
    emit('updated');
  } catch (error) {
    console.error('Error updating anamnesis:', error);
    emergencyContactError.value = 'Error al guardar la anamnesis. Intenta nuevamente.';
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
