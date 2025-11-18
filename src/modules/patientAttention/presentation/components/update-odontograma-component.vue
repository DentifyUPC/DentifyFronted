<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto py-10"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl md:max-w-5xl mx-4 p-8 animate-fadeIn"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Actualizar Estados de Dientes
      </h2>

      <!-- Instructions -->
      <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-blue-800 text-sm flex items-start gap-2">
          <i class="pi pi-info-circle mt-1"></i>
          <span>Selecciona el estado para cada diente. Los cambios se guardan automáticamente.</span>
        </p>
      </div>

      <!-- Teeth Grid - Fixed Size -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        <div
          v-for="item in odontogramItems"
          :key="item.id"
          class="h-40 border-2 border-gray-300 rounded-lg p-3 hover:border-teal-500 transition flex flex-col"
          :class="{ 'border-teal-500 bg-teal-50': loadingItem === item.id }"
        >
          <!-- Tooth Name -->
          <label class="block text-xs font-bold text-gray-700 mb-2 line-clamp-3 flex-shrink-0">
            {{ getTeethName(item.teethCode) }}
          </label>

          <!-- Current Status Badge -->
          <div class="mb-2 flex-shrink-0">
            <span v-if="getCurrentStatusName(form[item.id])" class="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-semibold">
              {{ getCurrentStatusName(form[item.id]) }}
            </span>
            <span v-else class="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              Sin estado
            </span>
          </div>

          <!-- Select Dropdown -->
          <div class="flex-grow relative flex flex-col">
            <select
              v-model.number="form[item.id]"
              @change="handleToothUpdate(item)"
              :disabled="loadingItem === item.id"
              class="flex-grow p-2 border border-gray-300 rounded text-xs bg-white focus:ring-2 focus:ring-teal-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option :value="null">-- Seleccionar --</option>
              <option v-for="status in toothStatuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
            <!-- Loading spinner -->
            <div v-if="loadingItem === item.id" class="absolute inset-0 flex items-center justify-center bg-white/50 rounded">
              <i class="pi pi-spin pi-spinner text-teal-600 text-sm"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Messages -->
      <div v-if="Object.keys(errors).length > 0" class="mb-6 space-y-2">
        <div v-for="(error, itemId) in errors" :key="itemId" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-800 flex items-center gap-2 text-sm">
            <i class="pi pi-exclamation-triangle"></i>
            <span>Diente {{ getTeethName(getToothCodeById(parseInt(itemId))) }}: {{ error }}</span>
          </p>
        </div>
      </div>

      <!-- Success Summary -->
      <div v-if="updateCount > 0" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-800 flex items-center gap-2 text-sm">
          <i class="pi pi-check-circle"></i>
          <span>✓ {{ updateCount }} diente(s) actualizado(s) correctamente</span>
        </p>
      </div>

      <!-- Close Button -->
      <div class="flex justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition flex items-center gap-2"
        >
          <i class="pi pi-check"></i>
          <span>Listo</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { odontogramItemRepositoryImpl } from '../../data/repositories/odontogramItemRepositoryImpl.js';
import { toothStatusRepositoryImpl } from '../../data/repositories/toothStatusRepositoryImpl.js';
import { getTeethName } from '../../data/constants/teeth-mapping.js';

const props = defineProps({
  odontogramId: { type: Number, required: true },
  odontogramItems: { type: Array, required: true },
});

const emit = defineEmits(['close', 'updated']);

const form = ref({});
const toothStatuses = ref([]);
const loadingItem = ref(null);
const errors = ref({});
const updateCount = ref(0);

const getCurrentStatusName = (statusId) => {
  if (!statusId) return '';
  const status = toothStatuses.value.find(s => s.id === statusId);
  return status?.name || '';
};

const getToothCodeById = (itemId) => {
  const item = props.odontogramItems.find(i => i.id === itemId);
  return item?.teethCode || null;
};

onMounted(async () => {
  try {
    // Cargar los estados disponibles de dientes
    toothStatuses.value = await toothStatusRepositoryImpl.getAll();
    console.log('🦷 Available tooth statuses:', toothStatuses.value);

    // Inicializar el formulario con los estados actuales
    props.odontogramItems.forEach(item => {
      const currentStatus = toothStatuses.value.find(
        status => status.name === item.toothStatusName
      );
      form.value[item.id] = currentStatus?.id || null;
      console.log(`🦷 Tooth ${item.teethCode} (ID: ${item.id}): status="${item.toothStatusName}" -> statusId: ${form.value[item.id]}`);
    });
  } catch (error) {
    console.error('Error loading tooth statuses:', error);
  }
});

const handleToothUpdate = async (item) => {
  const toothStatusId = form.value[item.id];
  
  if (!toothStatusId) {
    errors.value[item.id] = 'Selecciona un estado válido';
    return;
  }

  loadingItem.value = item.id;
  delete errors.value[item.id];

  try {
    console.log(`🦷 Updating tooth ${item.teethCode} (odontogramItemId: ${item.id}) with toothStatusId: ${toothStatusId}`);
    
    // Hacer update individual para este diente
    await odontogramItemRepositoryImpl.update(item.id, {
      toothStatusId: toothStatusId,
    });

    updateCount.value++;
    console.log(`✓ Tooth ${item.teethCode} updated successfully`);
  } catch (error) {
    console.error(`Error updating tooth ${item.teethCode}:`, error);
    errors.value[item.id] = error.message || 'Error al actualizar';
    // Revertir el cambio en el formulario
    const currentStatus = toothStatuses.value.find(
      status => status.name === item.toothStatusName
    );
    form.value[item.id] = currentStatus?.id || null;
  } finally {
    loadingItem.value = null;
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