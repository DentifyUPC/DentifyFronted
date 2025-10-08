<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <input
          v-model="store.query"
          @input="store.setQuery(store.query)"
          type="text"
          placeholder="Buscar servicio..."
          class="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <span class="text-gray-600 text-sm">
        Total: {{ store.count }}
      </span>
    </div>

    <div v-if="store.isLoading" class="text-center py-10 text-gray-500">
      Cargando servicios...
    </div>

    <div v-else-if="store.error" class="text-center text-red-500 py-10">
      Error: {{ store.error }}
    </div>

    <ul v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <li
          v-for="service in store.filtered"
          :key="service.id"
          class="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
          @click="$emit('selectService', service)"
      >
        <h2 class="font-semibold text-gray-800">{{ service.displayName() }}</h2>
      </li>

    </ul>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { serviceStore } from '../../stores/serviceStore.js';

const store = serviceStore();

onMounted(() => {
  store.fetchAll();
});
</script>
