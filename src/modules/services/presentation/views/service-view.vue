<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
    <h1 class="text-3xl font-semibold text-[#2B6D8C] mb-8">
      Servicios Disponibles
    </h1>

    <!-- Loader -->
    <div v-if="isLoading" class="flex items-center justify-center py-16">
      <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
      <span class="ml-3 text-gray-600">Cargando servicios...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-lg text-center py-10">
      ❌ Error al cargar los servicios: {{ error }}
    </div>

    <!-- Lista -->
    <div
        v-else
        class="w-full max-w-3xl bg-white rounded-2xl shadow-md divide-y divide-gray-200 overflow-hidden"
    >
      <div
          v-for="service in services"
          :key="service.id"
          class="flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition"
      >
        <div class="flex items-center gap-3 flex-nowrap min-w-0">
          <!-- Ícono -->
          <div
              class="flex items-center justify-center bg-[#2B6D8C]/10 rounded-full flex-shrink-0"
              style="width: 42px; height: 42px;"
          >
            <i class="pi pi-briefcase text-[#2B6D8C] text-lg"></i>
          </div>

          <!-- Texto -->
          <p
              class="text-gray-800 font-medium text-lg leading-none truncate"
              style="white-space: nowrap;"
              :title="service.displayName()"
          >
            {{ service.displayName().trim() }}
          </p>
        </div>

        <!-- Botón -->
        <button
            @click="openItemsModal(service)"
            class="text-[#2B6D8C] hover:text-[#1E4F67] text-sm font-semibold transition flex-shrink-0"
        >
          Ver Detalles
        </button>
      </div>
    </div>

    <!-- Sin servicios -->
    <div
        v-if="!isLoading && !services.length && !error"
        class="text-gray-500 text-center mt-10"
    >
      No hay servicios registrados.
    </div>

    <!-- Modal: ItemsPerServiceListComponent -->
    <ItemsPerServiceListComponent
        v-if="showModal"
        :service="selectedService"
        @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { servicesRepositoryImpl } from "@/modules/services/data/repositories/serviceRepositoryImpl.js";
import ItemsPerServiceListComponent from "@/modules/services/presentation/components/item-per-service-list-component.vue";

const services = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showModal = ref(false);
const selectedService = ref(null);

onMounted(async () => {
  try {
    const data = await servicesRepositoryImpl.getAll();
    services.value = data;
  } catch (err) {
    console.error("❌ Error cargando servicios:", err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
});

const openItemsModal = (service) => {
  selectedService.value = service;
  showModal.value = true;
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div[v-for] {
  animation: fadeIn 0.3s ease-out;
}

i {
  line-height: 1;
  display: block;
}
</style>
