<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-10"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-4 animate-fadeIn max-h-[90vh] overflow-y-auto"
    >
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-lg"></i>
      </button>

      <h2 class="text-lg font-semibold text-blue-700 mb-3 text-center">
        💊 Editar Medicamento
      </h2>

      <!-- Form -->
      <form @submit.prevent="handleUpdate" class="flex flex-col space-y-3">
        <!-- Medication Name -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Nombre del Medicamento *
          </label>
          <input
            v-model="form.medicationName"
            type="text"
            placeholder="Ej: Amoxicilina, Ibuprofeno..."
            class="w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            required
          />
          <div v-if="errors.medicationName" class="text-red-500 text-xs mt-0.5">
            {{ errors.medicationName }}
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Descripción / Instrucciones *
          </label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Dosis, frecuencia, duración..."
            class="w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            required
          ></textarea>
          <div v-if="errors.description" class="text-red-500 text-xs mt-0.5">
            {{ errors.description }}
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="validationError" class="p-2 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 flex items-center gap-1 text-xs">
            <i class="pi pi-exclamation-triangle text-xs"></i>
            <span>{{ validationError }}</span>
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-2 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-800 flex items-center gap-1 text-xs">
            <i class="pi pi-check-circle text-xs"></i>
            <span>{{ successMessage }}</span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="px-3 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-medium transition flex items-center gap-1"
          >
            <i class="pi pi-times text-xs"></i>
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded font-medium transition flex items-center gap-1"
          >
            <i v-if="!isSubmitting" class="pi pi-check text-xs"></i>
            <i v-else class="pi pi-spin pi-spinner text-xs"></i>
            <span>{{ isSubmitting ? 'Guardando...' : 'Guardar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { prescriptionItemRepositoryImpl } from '../../data/repositories/prescriptionItemRepositoryImpl.js';

const props = defineProps({
  prescriptionItem: { type: Object, required: true },
});

const emit = defineEmits(['close', 'updated']);

const form = ref({
  medicationName: '',
  description: '',
});

const isSubmitting = ref(false);
const validationError = ref('');
const successMessage = ref('');
const errors = ref({});

onMounted(() => {
  if (props.prescriptionItem) {
    form.value = {
      medicationName: props.prescriptionItem.medicationName || '',
      description: props.prescriptionItem.description || '',
    };
    console.log('💊 Editing prescription item:', props.prescriptionItem);
  }
});

const handleUpdate = async () => {
  validationError.value = '';
  successMessage.value = '';
  errors.value = {};

  if (!form.value.medicationName?.trim()) {
    errors.value.medicationName = 'El nombre del medicamento es requerido';
    return;
  }

  if (!form.value.description?.trim()) {
    errors.value.description = 'La descripción es requerida';
    return;
  }

  isSubmitting.value = true;

  try {
    console.log(`💊 Updating prescription item ID: ${props.prescriptionItem.id}`, form.value);
    
    await prescriptionItemRepositoryImpl.update(props.prescriptionItem.id, {
      medicationName: form.value.medicationName.trim(),
      description: form.value.description.trim(),
    });

    successMessage.value = '✓ Medicamento actualizado correctamente';
    console.log('✓ Prescription item updated successfully');

    setTimeout(() => {
      emit('updated');
    }, 1000);
  } catch (error) {
    console.error('Error updating prescription item:', error);
    validationError.value = 'Error al guardar: ' + (error.message || 'Intenta nuevamente');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
