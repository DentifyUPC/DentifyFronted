<template>
  <div class="min-h-screen bg-gray-50 py-10 px-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-teal-700 mb-8 text-center">
        Odontólogos Asociados a la Clínica
      </h1>

      <!-- Botón de agregar -->
      <div class="flex justify-end mb-6">
        <button
            @click="showAddModal = true"
            class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 shadow"
        >
          <i class="fas fa-plus"></i>
          Añadir Odontólogo
        </button>
      </div>

      <!-- Estado: Cargando -->
      <div v-if="isLoading" class="text-center text-gray-500 animate-pulse">
        Cargando odontólogos...
      </div>

      <!-- Estado: Sin resultados -->
      <div v-else-if="odontologists.length === 0" class="text-center text-gray-600">
        <p class="text-lg">No hay odontólogos registrados en esta clínica.</p>
      </div>

      <!-- Lista -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="o in odontologists"
            :key="o.id"
            class="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 border border-gray-100 flex flex-col justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="bg-teal-100 text-teal-700 p-4 rounded-full flex items-center justify-center">
              <i class="fas fa-user-md text-2xl"></i>
            </div>

            <div>
              <p class="text-lg font-semibold text-gray-800">
                {{ o.firstName }} {{ o.lastName }}
              </p>
              <p class="text-sm text-gray-600">
                {{ o.specialty || "Sin especialidad" }}
              </p>
              <p
                  class="text-sm mt-1 font-medium"
                  :class="o.isActive ? 'text-green-600' : 'text-red-500'"
              >
                {{ o.isActive ? "Activo" : "Inactivo" }}
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button
                @click="openDetails(o)"
                class="text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Detalles -->
      <Teleport to="#app">
        <OdontologistDetailsModal
            v-if="selectedOdontologist && userProfile"
            :odontologist="selectedOdontologist"
            :userProfile="userProfile"
            @close="selectedOdontologist = null"
        />
      </Teleport>

      <!-- Modal Agregar -->
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
    console.error("❌ Error al cargar odontólogos:", e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
</style>
