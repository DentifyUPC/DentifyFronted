<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 overflow-y-auto max-h-[90vh] animate-fadeInUp">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-[#2B6D8C] mb-6 text-center">
        {{ service.displayName?.() || service.name }}
      </h2>

      <div v-if="isLoading" class="text-center py-10 text-gray-500">
        <i class="pi pi-spin pi-spinner text-2xl text-[#2B6D8C]"></i>
        <p>Cargando ítems requeridos...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-6">
        ❌ {{ error }}
      </div>

      <ul v-else class="divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
        <li v-for="item in items" :key="item.id" class="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition">
          <span class="font-medium text-gray-700">{{ item.displayName?.() || item.name }}</span>
          <span class="text-sm text-gray-500">{{ item.quantityRequired }} {{ item.unitType }}</span>
        </li>
      </ul>

      <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4">
        <button @click="openAddServiceModal" class="bg-[#aacff3] text-black px-6 py-2 rounded-lg hover:bg-[#8fc5f0] transition">
          Agregar Servicio a Clínica
        </button>
        <button @click="$emit('close')" class="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition">
          Cerrar
        </button>
      </div>
    </div>

    <AddServicePerClinicComponent
        v-if="showAddServiceModal"
        :clinic-id="clinicId"
        :service-id="service.id"
        @close="showAddServiceModal = false"
        @added="$emit('close')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";
import { itemPerServiceRepositoryImpl } from "@/modules/services/data/repositories/itemPerServiceRepositoryImpl.js";
import AddServicePerClinicComponent from "@/modules/clinicManagement/presentation/components/add-service-per-clinic-component.vue";

const props = defineProps({ service: { type: Object, required: true } });
const authStore = useAuthStore();
const clinicId = computed(() => authStore.user?.clinicId ?? null);

const items = ref([]);
const isLoading = ref(true);
const error = ref(null);
const showAddServiceModal = ref(false);

const loadItems = async () => {
  try {
    isLoading.value = true;
    items.value = await itemPerServiceRepositoryImpl.getByServiceId(props.service.id);
  } catch (err) {
    console.error("❌ Error al cargar ítems:", err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
};

const openAddServiceModal = () => {
  if (!clinicId.value) {
    alert("⚠️ No se encontró la clínica del usuario. Inicia sesión nuevamente.");
    return;
  }
  showAddServiceModal.value = true;
};

onMounted(loadItems);
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