<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
    <div class="w-full max-w-4xl">
      <!-- Encabezado -->
      <div class="mb-6">
        <h1 class="text-3xl font-semibold text-[#2B6D8C]">🦷 Catálogo de Estados Dentales</h1>
        <p class="text-gray-600 mt-2">Lista de estados dentales disponibles para diagnóstico</p>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <PvProgressSpinner />
        <span class="ml-3 text-gray-600">Cargando estados dentales...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        {{ error }}
      </div>

      <!-- Lista de estados dentales -->
      <div v-else class="bg-white rounded-2xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#2B6D8C] text-white">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold">Nombre del Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="status in toothStatuses"
                :key="status.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-4 text-gray-600 font-medium">{{ status.id }}</td>
                <td class="px-6 py-4 text-gray-800">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-circle-fill text-[#2B6D8C] text-xs"></i>
                    <span class="font-medium">{{ status.displayName() }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Sin datos -->
          <div v-if="!hasData" class="p-8 text-center text-gray-500">
            <i class="pi pi-inbox text-4xl mb-3 block"></i>
            No hay estados dentales disponibles.
          </div>
        </div>

        <!-- Footer con contador -->
        <div v-if="hasData" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            Total de estados: <span class="font-semibold text-gray-800">{{ count }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useToothStatusStore } from '../../stores/toothStatusStore.js';

const store = useToothStatusStore();

const toothStatuses = computed(() => store.toothStatuses);
const isLoading = computed(() => store.isLoading);
const error = computed(() => store.error);
const count = computed(() => store.count);
const hasData = computed(() => store.hasData);

onMounted(async () => {
  await store.fetchAll();
});
</script>

<style scoped>
table {
  border-collapse: collapse;
}
</style>
