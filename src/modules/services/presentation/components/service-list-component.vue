<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div class="modal-content relative">
      <!-- Botón de cerrar -->
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <!-- Contenido principal -->
      <h1 class="text-2xl font-semibold text-[#2B6D8C] mb-6 text-center">
        Servicios Disponibles
      </h1>

      <!-- Loader -->
      <div v-if="isLoading" class="flex items-center justify-center py-10">
        <i class="pi pi-spin pi-spinner text-3xl text-[#2B6D8C]"></i>
        <span class="ml-3 text-gray-600">Cargando servicios...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-500 text-lg text-center py-8">
        ❌ {{ error }}
      </div>

      <!-- Lista -->
      <div
          v-else
          class="divide-y divide-gray-200 rounded-lg border border-gray-100 overflow-hidden"
      >
        <div
            v-for="service in services"
            :key="service.id"
            class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
        >
          <div class="flex items-center gap-3 flex-nowrap min-w-0">
            <div
                class="flex items-center justify-center bg-[#2B6D8C]/10 rounded-full flex-shrink-0"
                style="width: 38px; height: 38px;"
            >
              <i class="pi pi-briefcase text-[#2B6D8C] text-base"></i>
            </div>
            <p
                class="text-gray-800 font-medium text-base truncate"
                :title="service.displayName?.() || service.name"
            >
              {{ service.displayName?.() || service.name }}
            </p>
          </div>

          <button
              @click="openItemsModal(service)"
              class="text-[#2B6D8C] hover:text-[#1E4F67] text-sm font-semibold transition"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      <!-- Sin servicios -->
      <div v-if="!isLoading && !services.length && !error" class="text-gray-500 text-center mt-6">
        No hay servicios registrados.
      </div>

      <!-- Modal interno de items -->
      <ItemsPerServiceListComponent
          v-if="showModal"
          :service="selectedService"
          @close="showModal = false"
      />
    </div>
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
.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  animation: fadeInUp 0.25s ease-out;
  max-height: 85vh;
  overflow-y: auto;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
