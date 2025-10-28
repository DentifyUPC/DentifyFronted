<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-fadeIn overflow-y-auto max-h-[90vh]"
    >
      <!-- Botón cerrar -->
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <!-- Título -->
      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Detalles del Paciente
      </h2>

      <!-- Información principal -->
      <div class="flex items-center gap-5 mb-6">
        <div class="flex-shrink-0">
          <i class="pi pi-user text-6xl text-teal-600"></i>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-800">
            {{ patient.firstName }} {{ patient.lastName }}
          </h3>
          <p class="text-gray-600">{{ patient.email }}</p>
          <p class="text-gray-600 mt-1">{{ patient.phoneNumber || "—" }}</p>
        </div>
      </div>

      <!-- Datos detallados -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700">
        <p><strong>Género:</strong> {{ patient.gender || '—' }}</p>
        <p><strong>Edad:</strong> {{ patient.age || '—' }}</p>
        <p><strong>Fecha de nacimiento:</strong> {{ patient.birthDate || '—' }}</p>
        <p><strong>Departamento:</strong> {{ patient.department || '—' }}</p>
        <p><strong>Provincia:</strong> {{ patient.province || '—' }}</p>
        <p><strong>Distrito:</strong> {{ patient.district || '—' }}</p>
        <p class="md:col-span-2"><strong>Dirección:</strong> {{ patient.street || '—' }}</p>
      </div>

      <!-- Botón cerrar -->
      <div class="flex justify-end gap-3 mt-8">
        <button
            @click="$emit('close')"
            class="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  patient: { type: Object, required: true },
  userProfile: { type: Object, required: false, default: () => ({}) },
});
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
