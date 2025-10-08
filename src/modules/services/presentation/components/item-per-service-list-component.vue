<template>
  <div class="mt-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-3">Ítems requeridos</h3>
    <div v-if="store.isLoading" class="text-center text-gray-500 py-3">
      Cargando ítems requeridos...
    </div>
    <div v-else-if="store.error" class="text-center text-red-500 py-3">
      Error: {{ store.error }}
    </div>
    <ul v-else class="divide-y divide-gray-100 border border-gray-200 rounded-lg">
      <li
          v-for="item in store.items"
          :key="item.id"
          class="flex justify-between items-center p-3 hover:bg-gray-50 transition"
      >
        <div>
          <p class="font-medium text-gray-800">{{ item.name }}</p>
          <p class="text-sm text-gray-500">Unidad: {{ item.unitType }}</p>
        </div>
        <span class="text-gray-700 font-semibold">
          {{ item.quantityRequired }}
        </span>
      </li>

      <li v-if="!store.items.length" class="text-center text-gray-500 py-3">
        No hay ítems registrados para este servicio.
      </li>
    </ul>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useItemPerServiceStore } from '../../stores/itemPerServiceStore.js';

const props = defineProps({
  serviceId: {
    type: Number,
    required: true,
  },
});

const store = useItemPerServiceStore();

watch(
    () => props.serviceId,
    (newVal) => {
      if (newVal) store.fetchByService(newVal);
    },
    { immediate: true }
);
</script>
