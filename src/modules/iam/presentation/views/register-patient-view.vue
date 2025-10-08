<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-teal-700">Registro de Paciente</h1>

      <form @submit.prevent="onRegister">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700">Nombre</label>
            <input v-model="firstName" type="text" class="w-full border rounded p-2 mt-1" required />
          </div>
          <div>
            <label class="block text-gray-700">Apellido</label>
            <input v-model="lastName" type="text" class="w-full border rounded p-2 mt-1" required />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">DNI / Carnet de Extranjería</label>
          <input v-model="username" type="text" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Tipo de Documento</label>
          <select v-model="identificationTypeId" class="w-full border rounded p-2 mt-1">
            <option disabled value="">Selecciona un tipo</option>
            <option :value="1">DNI</option>
            <option :value="2">Carnet de Extranjería</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Fecha de Nacimiento</label>
          <input v-model="birthDate" type="date" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Contraseña</label>
          <input v-model="password" type="password" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Clínica</label>
          <select v-model="clinicId" class="w-full border rounded p-2 mt-1" required>
            <option disabled value="">Selecciona una clínica</option>
            <option v-for="clinic in clinics" :key="clinic.id" :value="clinic.id">
              {{ clinic.name }}
            </option>
          </select>
        </div>

        <button type="submit" class="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition">
          Crear cuenta
        </button>

        <p class="mt-4 text-center">
          ¿Ya tienes cuenta?
          <span class="text-teal-700 cursor-pointer" @click="goToLogin">Inicia sesión</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";
import { clinicRepositoryImpl } from "@/modules/clinicManagement/data/repositories/clinicRepositoryImpl.js";

const router = useRouter();
const authStore = useAuthStore();

const firstName = ref("");
const lastName = ref("");
const username = ref("");
const password = ref("");
const email = ref("");
const birthDate = ref("");
const identificationTypeId = ref("");
const clinicId = ref("");
const clinics = ref([]);

onMounted(async () => {
  try {
    clinics.value = await clinicRepositoryImpl.getClinicsForRegister();
  } catch (error) {
    console.error("❌ Error al cargar clínicas:", error);
  }
});

const onRegister = async () => {
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    password: password.value,
    birthDate: birthDate.value,
    email: email.value,
    identificationTypeId: identificationTypeId.value,
    clinicId: clinicId.value,
  };

  const success = await authStore.registerPatient(payload);
  if (success) router.push("/login");
};

const goToLogin = () => router.push("/login");
</script>
