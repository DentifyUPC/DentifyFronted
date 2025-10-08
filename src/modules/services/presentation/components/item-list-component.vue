
<template>
  <div class="p-6 bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold text-center text-[#2B6D8C] mb-6">
      Catálogo de Ítems
    </h2>

    <div class="mb-4">
      <input
          v-model="store.query"
          @input="store.setQuery(store.query)"
          type="text"
          placeholder="Buscar por nombre o unidad..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AACFF3] focus:outline-none"
      />
    </div>


    <div v-if="store.isLoading" class="text-center text-gray-500 py-4">
      Cargando ítems...
    </div>

    <!-- ⚠️ Error -->
    <div v-else-if="store.error" class="text-center text-red-600 py-4">
      Error: {{ store.error }}
    </div>

    <!-- 📋 Lista de items -->
    <div v-else class="divide-y divide-gray-100 border border-gray-200 rounded-lg">
      <div
          v-for="item in store.filtered"
          :key="item.id"
          class="flex justify-between items-center p-4 hover:bg-[#F7FBFF] transition cursor-pointer"
      >
        <span class="font-medium text-gray-800">{{ item.displayName() }}</span>
        <span class="text-gray-500 text-sm">{{ item.displayUnit() }}</span>
      </div>
      <div v-if="!store.filtered.length" class="text-center text-gray-500 py-3">
        No se encontraron ítems.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useItemsStore } from "@/modules/services/stores/itemStore.js";

const store = useItemsStore();

onMounted(() => {
  store.fetchAll();
});
</script>
