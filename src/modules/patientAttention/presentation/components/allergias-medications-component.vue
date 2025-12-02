<template>
  <div class="bg-white rounded-xl shadow-md p-8 border-l-4 border-red-500">
    <div class="flex items-center justify-between mb-6">
      <div>
        <i class="pi pi-shield text-red-500 text-4xl mb-4 block"></i>
        <h2 class="text-2xl font-bold text-gray-800">Alergias y Medicamentos</h2>
        <p class="text-gray-600 text-sm mt-1">Registre las alergias y medicamentos relevantes</p>
      </div>
      <button
        @click="showForm = true"
        class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition"
      >
        <i class="pi pi-plus"></i>
        <span>Agregar Alergia</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="allergiasMedicationsStore.isLoading" class="flex items-center justify-center py-8">
      <i class="pi pi-spin pi-spinner text-3xl text-red-500"></i>
      <span class="ml-3 text-gray-600">Cargando alergias...</span>
    </div>

    <!-- Error State -->
    <div v-if="allergiasMedicationsStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4 flex items-start gap-3">
      <i class="pi pi-exclamation-triangle mt-1"></i>
      <span>{{ allergiasMedicationsStore.error }}</span>
    </div>

    <!-- Allergies List -->
    <div v-if="!allergiasMedicationsStore.isLoading && allergiasMedicationsStore.allergies.length" class="space-y-3">
      <div
        v-for="allergy in allergiasMedicationsStore.allergies"
        :key="allergy.id"
        class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
      >
        <div class="flex-1 flex items-start gap-3">
          <i class="pi pi-exclamation-circle text-red-500 text-xl mt-1"></i>
          <div>
            <p class="font-semibold text-gray-800">{{ allergy.medicationName }}</p>
            <p class="text-xs text-gray-500 mt-1">
              Registrado: {{ allergy.formattedCreatedAt }}
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="editAllergy(allergy)"
            class="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm flex items-center gap-1"
          >
            <i class="pi pi-pencil text-xs"></i>
            Editar
          </button>
          <button
            @click="deleteAllergy(allergy.id)"
            class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
          >
            <i class="pi pi-trash text-xs"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!allergiasMedicationsStore.isLoading && !allergiasMedicationsStore.allergies.length" class="text-center py-8 bg-gray-50 rounded-lg">
      <i class="pi pi-inbox text-4xl text-gray-400 block mb-3"></i>
      <p class="text-gray-500">No hay alergias registradas</p>
      <p class="text-gray-400 text-sm mt-1">Agregue alergias para mantener el historial médico actualizado</p>
    </div>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 w-full max-w-md max-h-96 overflow-y-auto shadow-xl">
        <div class="flex items-center gap-3 mb-6">
          <i class="pi pi-shield text-red-500 text-2xl"></i>
          <h4 class="text-xl font-semibold text-gray-800">
            {{ editingAllergy ? 'Editar Alergia' : 'Registrar Alergia' }}
          </h4>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="pi pi-asterisk text-red-500 text-xs mr-1"></i>
              Nombre del Medicamento/Alergia
            </label>
            <input
              v-model="formData.medicationName"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ej: Penicilina, Ibuprofeno, Mariscos"
              autofocus
            />
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex gap-2">
            <i class="pi pi-info-circle mt-0.5"></i>
            <span>Asegúrese de ingresar el nombre completo del medicamento o alergia para mayor precisión.</span>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeForm"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!formData.medicationName || allergiasMedicationsStore.isLoading"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
            >
              <i v-if="!allergiasMedicationsStore.isLoading" class="pi text-sm" :class="editingAllergy ? 'pi-check' : 'pi-save'"></i>
              <span v-if="allergiasMedicationsStore.isLoading">Guardando...</span>
              <span v-else>{{ editingAllergy ? 'Actualizar' : 'Guardar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAllergiasMedicationsStore } from '../../stores/allergiasMedicationsStore.js';

const props = defineProps({
  clinicalRecordId: {
    type: Number,
    required: true,
  },
});

const allergiasMedicationsStore = useAllergiasMedicationsStore();
const showForm = ref(false);
const editingAllergy = ref(null);
const formData = ref({
  medicationName: '',
});

onMounted(async () => {
  await allergiasMedicationsStore.fetchByClinicalRecordId(props.clinicalRecordId);
});

const submitForm = async () => {
  try {
    if (editingAllergy.value) {
      await allergiasMedicationsStore.update(editingAllergy.value.id, formData.value);
    } else {
      await allergiasMedicationsStore.create({
        ...formData.value,
        clinicalRecordId: props.clinicalRecordId,
      });
    }
    closeForm();
  } catch (error) {
    console.error('Error en submitForm:', error);
  }
};

const editAllergy = (allergy) => {
  editingAllergy.value = allergy;
  formData.value = { medicationName: allergy.medicationName };
  showForm.value = true;
};

const deleteAllergy = async (allergyId) => {
  if (confirm('¿Está seguro de que desea eliminar esta alergia?')) {
    try {
      await allergiasMedicationsStore.delete(allergyId);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  }
};

const closeForm = () => {
  showForm.value = false;
  editingAllergy.value = null;
  formData.value = { medicationName: '' };
};
</script>

<style scoped>
@import "primeicons/primeicons.css";
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
.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  animation: fadeInUp 0.25s ease-out;
}
</style>
