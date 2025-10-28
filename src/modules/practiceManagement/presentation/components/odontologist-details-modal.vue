<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-fadeIn overflow-y-auto max-h-[90vh]"
    >

      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>


      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Detalles del Odontólogo
      </h2>


      <div class="flex items-center gap-5 mb-6">
        <div class="flex-shrink-0">
          <i class="pi pi-user text-6xl text-teal-600"></i>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-800">
            {{ odontologist.firstName }} {{ odontologist.lastName }}
          </h3>
          <p class="text-gray-600">{{ odontologist.email }}</p>
          <p>
            <span
                class="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium"
                :class="odontologist.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              {{ odontologist.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700">
        <p><strong>Teléfono:</strong> {{ odontologist.phoneNumber || '—' }}</p>
        <p><strong>Género:</strong> {{ odontologist.gender || '—' }}</p>
        <p><strong>Especialidad:</strong> {{ odontologist.specialty || '—' }}</p>
        <p><strong>Colegiatura:</strong> {{ odontologist.professionalLicenseNumber || '—' }}</p>
        <p><strong>Reg. Especialidad:</strong> {{ odontologist.specialtyRegistrationNumber || '—' }}</p>
        <p><strong>Edad:</strong> {{ odontologist.age || '—' }}</p>
        <p><strong>Departamento:</strong> {{ odontologist.department || '—' }}</p>
        <p><strong>Provincia:</strong> {{ odontologist.province || '—' }}</p>
        <p><strong>Distrito:</strong> {{ odontologist.district || '—' }}</p>
        <p class="md:col-span-2"><strong>Dirección:</strong> {{ odontologist.street || '—' }}</p>
      </div>

      <div class="flex justify-end gap-3 mt-8">
        <button
            @click="$emit('close')"
            class="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cerrar
        </button>
        <button
            @click="openUpdateModal"
            class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Actualizar información
        </button>
      </div>


      <update-odontologist-profile-component
          v-if="showUpdateModal"
          :odontologist="odontologist"
          :userProfile="userProfile"
          @close="showUpdateModal = false"
          @updated="handleUpdated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import UpdateOdontologistProfileComponent from "./update-odontologist-profile-component.vue";

const props = defineProps({
  odontologist: { type: Object, required: true },
  userProfile: { type: Object, required: false, default: () => ({}), },
});

const emit = defineEmits(["close", "updated"]);

const showUpdateModal = ref(false);

const openUpdateModal = () => {
  showUpdateModal.value = true;
};

const handleUpdated = (updatedData) => {

  Object.assign(props.odontologist, updatedData);

  emit("updated", updatedData);
  showUpdateModal.value = false;
};

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

