<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 animate-fadeIn overflow-y-auto max-h-[85vh]">
      <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-[#aacff3] mb-6 text-center">
        Anadir Nuevo Odontologo
      </h2>

      <form @submit.prevent="registerOdontologist" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-gray-700 text-sm mb-1">Nombre</label>
            <input v-model="firstName" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#aacff3]" required />
          </div>
          <div>
            <label class="block text-gray-700 text-sm mb-1">Apellido</label>
            <input v-model="lastName" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#aacff3]" required />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 text-sm mb-1">Usuario (DNI o Codigo)</label>
          <input v-model="username" type="text" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#aacff3]" required />
        </div>

        <div>
          <label class="block text-gray-700 text-sm mb-1">Correo Electronico</label>
          <input v-model="email" type="email" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#aacff3]" required />
        </div>

        <div>
          <label class="block text-gray-700 text-sm mb-1">Contrasena</label>
          <input v-model="password" type="password" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#aacff3]" required />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-gray-700 text-sm mb-1">Tipo de Documento</label>
            <select v-model="identificationTypeId" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#aacff3]">
              <option disabled value="">Selecciona</option>
              <option :value="1">DNI</option>
              <option :value="2">Carnet de Extranjeria</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 text-sm mb-1">Fecha de Nacimiento</label>
            <input v-model="birthDate" type="date" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#aacff3]" />
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
              type="submit"
              class="px-4 py-2 rounded-md bg-[#aacff3] text-black hover:bg-[#8fc5f0] transition shadow-sm"
          >
            Registrar
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
    roleId: 2,
  };

  try {
    const newO = await authStore.registerOdontologist(payload);
    emit("added", newO);
  } catch (e) {
    console.error("Error al registrar odontologo:", e);
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
  background-color: rgba(0,0,0,0.3);
  backdrop-filter: blur(3px);
  animation: fadeOverlay 0.25s ease-out;
}

@keyframes fadeOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>