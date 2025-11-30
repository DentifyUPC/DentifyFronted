<!-- AddItemModal.vue -->
<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
      <h2 class="text-xl font-bold text-[#2B6D8C] mb-4">Agregar Ítem al Inventario</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Seleccionar Ítem</label>
        <select
            v-model="form.itemId"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#AACFF3]"
        >
          <option value="" disabled>Seleccione un ítem...</option>
          <option
              v-for="item in itemsStore.filtered"
              :key="item.id"
              :value="item.id"
          >
            {{ item.displayName() }} ({{ item.displayUnit() }})
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
          <input v-model.number="form.availableStock" type="number" min="0" class="w-full border rounded-lg p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
          <input v-model.number="form.minimumStock" type="number" min="0" class="w-full border rounded-lg p-2" />
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
        <input v-model.number="form.price" type="number" step="0.01" class="w-full border rounded-lg p-2" />
      </div>

      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Cancelar</button>
        <button @click="saveItem" class="px-4 py-2 rounded-lg bg-[#2B6D8C] text-white hover:bg-[#1E4F67]">
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useItemsStore } from '@/modules/services/stores/itemStore.js';
import { useItemPerClinicStore } from '@/modules/clinicManagement/stores/itemPerClinicStore.js';

const props = defineProps({ visible: Boolean, clinicId: Number });
const emit = defineEmits(['close']);

const itemsStore = useItemsStore();
const itemPerClinicStore = useItemPerClinicStore();

const form = reactive({
  itemId: '',
  availableStock: 0,
  minimumStock: 0,
  price: 0,
});

async function saveItem() {
  try {
    await itemPerClinicStore.createItem({
      itemId: form.itemId,
      availableStock: form.availableStock,
      minimumStock: form.minimumStock,
      price: form.price,
      clinicId: props.clinicId,
    });
    emit('close');
  } catch (err) {
    console.error('❌ Error al agregar ítem:', err);
  }
}
</script>
<style scoped>
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