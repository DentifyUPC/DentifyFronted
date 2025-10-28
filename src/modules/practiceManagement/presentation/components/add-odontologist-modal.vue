<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 animate-fadeIn overflow-y-auto max-h-[90vh]">
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        Añadir Nuevo Odontólogo
      </h2>

      <form @submit.prevent="registerOdontologist" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700">Nombre</label>
            <input v-model="firstName" type="text" class="w-full border rounded p-2 mt-1" required />
          </div>
          <div>
            <label class="block text-gray-700">Apellido</label>
            <input v-model="lastName" type="text" class="w-full border rounded p-2 mt-1" required />
          </div>
        </div>

        <div>
          <label class="block text-gray-700">Usuario (DNI o Código)</label>
          <input v-model="username" type="text" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div>
          <label class="block text-gray-700">Correo Electrónico</label>
          <input v-model="email" type="email" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div>
          <label class="block text-gray-700">Contraseña</label>
          <input v-model="password" type="password" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700">Tipo de Documento</label>
            <select v-model="identificationTypeId" class="w-full border rounded p-2 mt-1">
              <option disabled value="">Selecciona</option>
              <option :value="1">DNI</option>
              <option :value="2">Carnet de Extranjería</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700">Fecha de Nacimiento</label>
            <input v-model="birthDate" type="date" class="w-full border rounded p-2 mt-1" />
          </div>
        </div>

        <div class="text-right mt-6">
          <button
              type="submit"
              class="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            Registrar Odontólogo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";

const emit = defineEmits(["close", "added"]);
const authStore = useAuthStore();

const firstName = ref("");
const lastName = ref("");
const username = ref("");
const password = ref("");
const email = ref("");
const birthDate = ref("");
const identificationTypeId = ref("");

const registerOdontologist = async () => {
  const admin = JSON.parse(localStorage.getItem("user") || "{}");

  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    password: password.value,
    birthDate: birthDate.value,
    email: email.value,
    identificationTypeId: identificationTypeId.value,
    clinicId: admin.clinicId,
    roleId: 3, // Rol de ODONTOLOGIST
  };

  try {
    const newO = await authStore.registerOdontologist(payload);
    emit("added", newO);
  } catch (e) {
    console.error("❌ Error al registrar odontólogo:", e);
  }
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
