<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-10"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 animate-fadeIn max-h-[90vh] overflow-y-auto"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-lg font-semibold text-blue-700 mb-3 text-center">
        💊 Editar Prescripción
      </h2>

      <!-- Prescription Effects Section -->
      <div class="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-800 mb-2">Efectos / Indicaciones</h3>
        <form @submit.prevent="handleUpdatePrescription" class="flex flex-col space-y-2">
          <!-- Effects -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Efectos / Indicaciones *
            </label>
            <textarea
              v-model="form.effects"
              rows="2"
              placeholder="Describe los efectos esperados, indicaciones de uso..."
              class="w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
              required
            ></textarea>
            <div v-if="errors.effects" class="text-red-500 text-sm mt-1">
              {{ errors.effects }}
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isSubmittingPrescription"
              class="px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg font-medium transition flex items-center gap-1"
            >
              <i v-if="!isSubmittingPrescription" class="pi pi-check text-xs"></i>
              <i v-else class="pi pi-spin pi-spinner text-xs"></i>
              <span>{{ isSubmittingPrescription ? 'Guardando...' : 'Guardar' }}</span>
            </button>
          </div>
        </form>

        <!-- Error/Success Messages -->
        <div v-if="prescriptionValidationError" class="p-2 bg-red-50 border border-red-200 rounded-lg mt-2">
          <p class="text-red-800 flex items-center gap-1 text-xs">
            <i class="pi pi-exclamation-triangle text-xs"></i>
            <span>{{ prescriptionValidationError }}</span>
          </p>
        </div>
        <div v-if="prescriptionSuccessMessage" class="p-2 bg-green-50 border border-green-200 rounded-lg mt-2">
          <p class="text-green-800 flex items-center gap-1 text-xs">
            <i class="pi pi-check-circle text-xs"></i>
            <span>{{ prescriptionSuccessMessage }}</span>
          </p>
        </div>
      </div>

      <!-- Prescription Items Section -->
      <div class="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-blue-800">💊 Medicamentos</h3>
        </div>

        <!-- Loading Items -->
        <div v-if="isLoadingItems" class="flex items-center justify-center py-2">
          <i class="pi pi-spin pi-spinner text-sm text-blue-600"></i>
          <span class="ml-2 text-gray-600 text-xs">Cargando...</span>
        </div>

        <!-- Prescription Items List -->
        <div v-else-if="prescriptionItems.length > 0" class="space-y-2">
          <div
            v-for="item in prescriptionItems"
            :key="item.id"
            class="bg-white p-3 rounded-lg border border-blue-200 hover:shadow-md transition"
          >
            <div class="flex items-start justify-between">
              <div class="flex-grow">
                <p class="text-xs text-gray-500 mb-0.5">ID: {{ item.id }}</p>
                <h4 class="font-semibold text-blue-700 text-sm mb-1">{{ item.medicationName }}</h4>
                <p class="text-xs text-gray-700">{{ item.description }}</p>
              </div>
              <button
                @click="openEditItemModal(item)"
                class="ml-2 px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 transition flex-shrink-0"
              >
                <i class="pi pi-pencil text-xs"></i>
                <span>Editar</span>
              </button>
            </div>
          </div>
          <!-- Add New Medication Button -->
          <button
            @click="openCreateItemModal"
            class="w-full mt-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-1 transition"
          >
            <i class="pi pi-plus text-xs"></i>
            <span>Agregar</span>
          </button>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-2">
          <i class="pi pi-inbox text-2xl text-gray-400 mb-1 block"></i>
          <p class="text-gray-600 font-medium text-xs mb-1">Sin medicamentos</p>
          <button
            @click="openCreateItemModal"
            class="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 transition mx-auto"
          >
            <i class="pi pi-plus text-xs"></i>
            <span>Crear</span>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-2 pt-3 border-t">
        <button
          @click="$emit('close')"
          class="px-3 py-1 text-xs text-gray-700 bg-gray-200 hover:bg-gray-300 rounded font-medium transition flex items-center gap-1"
        >
          <i class="pi pi-times text-xs"></i>
          <span>Cerrar</span>
        </button>
      </div>
    </div>

    <!-- Create Prescription Item Modal -->
    <CreatePrescriptionItemComponent
      v-if="showCreateItemModal"
      :prescription-id="props.prescription.id"
      @close="closeCreateItemModal"
      @created="handleItemCreated"
    />

    <!-- Update Prescription Item Modal -->
    <UpdatePrescriptionItemComponent
      v-if="showEditItemModal && selectedItem"
      :prescription-item="selectedItem"
      @close="closeEditItemModal"
      @updated="handleItemUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { prescriptionRepositoryImpl } from '../../data/repositories/prescriptionRepositoryImpl.js';
import { prescriptionItemRepositoryImpl } from '../../data/repositories/prescriptionItemRepositoryImpl.js';
import CreatePrescriptionItemComponent from './create-prescription-item-component.vue';
import UpdatePrescriptionItemComponent from './update-prescription-item-component.vue';

const props = defineProps({
  prescription: { type: Object, required: true },
});

const emit = defineEmits(['close', 'updated']);

const form = ref({
  effects: '',
});

const prescriptionItems = ref([]);
const isSubmittingPrescription = ref(false);
const isLoadingItems = ref(false);
const prescriptionValidationError = ref('');
const prescriptionSuccessMessage = ref('');
const errors = ref({});

const showCreateItemModal = ref(false);
const showEditItemModal = ref(false);
const selectedItem = ref(null);

onMounted(async () => {
  if (props.prescription) {
    form.value = {
      effects: props.prescription.effects || '',
    };
    console.log('💊 Editing prescription:', props.prescription);
    console.log('💊 Prescription ID:', props.prescription.id);
    
    // Load prescription items
    await loadPrescriptionItems();
  }
});

const loadPrescriptionItems = async () => {
  isLoadingItems.value = true;
  try {
    console.log(`💊 Loading prescription items for prescription ID: ${props.prescription.id}`);
    const items = await prescriptionItemRepositoryImpl.getByPrescriptionId(props.prescription.id);
    prescriptionItems.value = items || [];
    console.log('💊 Prescription items loaded:', items);
  } catch (error) {
    console.error('❌ Error loading prescription items:', error);
    prescriptionItems.value = [];
  } finally {
    isLoadingItems.value = false;
  }
};

const handleUpdatePrescription = async () => {
  prescriptionValidationError.value = '';
  prescriptionSuccessMessage.value = '';
  errors.value = {};

  if (!form.value.effects?.trim()) {
    errors.value.effects = 'Los efectos/indicaciones son requeridos';
    return;
  }

  isSubmittingPrescription.value = true;

  try {
    console.log(`💊 Updating prescription ID: ${props.prescription.id}`, form.value);
    
    await prescriptionRepositoryImpl.update(props.prescription.id, {
      effects: form.value.effects.trim(),
    });

    prescriptionSuccessMessage.value = '✓ Prescripción actualizada correctamente';
    console.log('✓ Prescription updated successfully');

    setTimeout(() => {
      emit('updated');
    }, 1500);
  } catch (error) {
    console.error('Error updating prescription:', error);
    prescriptionValidationError.value = 'Error al guardar: ' + (error.message || 'Intenta nuevamente');
  } finally {
    isSubmittingPrescription.value = false;
  }
};

const openCreateItemModal = () => {
  showCreateItemModal.value = true;
};

const closeCreateItemModal = () => {
  showCreateItemModal.value = false;
};

const handleItemCreated = async () => {
  await loadPrescriptionItems();
  closeCreateItemModal();
};

const openEditItemModal = (item) => {
  selectedItem.value = item;
  showEditItemModal.value = true;
};

const closeEditItemModal = () => {
  showEditItemModal.value = false;
  selectedItem.value = null;
};

const handleItemUpdated = async () => {
  await loadPrescriptionItems();
  closeEditItemModal();
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