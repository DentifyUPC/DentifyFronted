<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-[#aacff3] mb-8 text-center">
        Odontologos Asociados a la Clinica
      </h1>

      <div class="flex justify-end mb-6">
        <button
            @click="showAddModal = true"
            class="bg-[#aacff3] text-black px-4 py-2 rounded-md hover:bg-[#8fc5f0] transition flex items-center gap-2 shadow-sm"
        >
          <i class="fas fa-plus"></i>
          Anadir Odontologo
        </button>
      </div>

      <div v-if="isLoading" class="text-center text-gray-400 animate-pulse">
        Cargando odontologos...
      </div>

      <div v-else-if="odontologists.length === 0" class="text-center text-gray-500">
        <p class="text-lg">No hay odontologos registrados en esta clinica.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
            v-for="o in odontologists"
            :key="o.id"
            class="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border border-gray-100 flex flex-col justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="bg-[#aacff3]/20 text-black p-3 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-user-md"></i>
            </div>

            <div>
              <p class="text-md font-semibold text-gray-800">
                {{ o.firstName }} {{ o.lastName }}
              </p>
              <p class="text-sm text-gray-500">
                {{ o.specialty || "Sin especialidad" }}
              </p>
              <p class="text-xs text-gray-400">
                {{ o.shiftName || "Sin turno asignado" }}
              </p>
              <p
                  class="text-xs mt-1 font-medium"
                  :class="o.isActive ? 'text-green-600' : 'text-red-500'"
              >
                {{ o.isActive ? "Activo" : "Inactivo" }}
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-3">
            <button
                @click="openDetails(o)"
                class="bg-[#aacff3] text-black px-3 py-1.5 rounded-md text-sm hover:bg-[#8fc5f0] transition-shadow shadow-sm"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>

      <Teleport to="#app">
        <OdontologistDetailsModal
            v-if="selectedOdontologist && userProfile"
            :odontologist="selectedOdontologist"
            :userProfile="userProfile"
            @close="selectedOdontologist = null"
            @updated="handleOdontologistUpdated"
        />
      </Teleport>

      <Teleport to="#app">
        <AddOdontologistModal
            v-if="showAddModal"
            @close="showAddModal = false"
            @added="handleOdontologistAdded"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { odontologistRepositoryImpl } from "@/modules/practiceManagement/data/repositories/odontologistRepositoryImpl.js";
import OdontologistDetailsModal from "@/modules/practiceManagement/presentation/components/odontologist-details-modal.vue";
import AddOdontologistModal from "@/modules/practiceManagement/presentation/components/add-odontologist-modal.vue";

const odontologists = ref([]);
const isLoading = ref(true);
const selectedOdontologist = ref(null);
const showAddModal = ref(false);
const userProfile = ref(null);

const openDetails = (o) => {
  selectedOdontologist.value = o;
};

const handleOdontologistAdded = (newO) => {
  odontologists.value.push(newO);
  showAddModal.value = false;
};

const handleOdontologistUpdated = (updatedData) => {
  const index = odontologists.value.findIndex(o => o.id === updatedData.id);
  if (index !== -1) {
    odontologists.value[index] = updatedData;
  }
  selectedOdontologist.value = null;
};

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  userProfile.value = user;

  if (!user || !user.clinicId) {
    isLoading.value = false;
    return;
  }

  try {
    odontologists.value = await odontologistRepositoryImpl.getAllByClinic(user.clinicId);
  } catch (e) {
    console.error("Error al cargar odontologos:", e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";

button {
  font-weight: 500;
}
</style>