<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
      <h1 class="text-2xl font-bold mb-6 text-center text-teal-700">
        Registro de Paciente
      </h1>

      <form @submit.prevent="onRegister" class="">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700">Nombre</label>
            <input
              v-model="firstName"
              type="text"
              class="w-full border rounded p-2 mt-1 focus:ring-teal-400 focus:border-teal-400"
              required
            />
          </div>
          <div>
            <label class="block text-gray-700">Apellido</label>
            <input
              v-model="lastName"
              type="text"
              class="w-full border rounded p-2 mt-1 focus:ring-teal-400 focus:border-teal-400"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700">Tipo de Documento</label>
            <select
              v-model="identificationTypeId"
              class="w-full border rounded p-2 mt-1 focus:ring-teal-400 focus:border-teal-400"
              required
            >
              <option disabled value="">Selecciona un tipo</option>
              <option :value="1">DNI</option>
              <option :value="2">Carnet de Extranjería</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700"
              >DNI / Carnet de Extranjería</label
            >
            <input
              v-model="username"
              type="text"
              class="w-full border rounded p-2 mt-1 focus:ring-teal-400 focus:border-teal-400"
              required
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Fecha de Nacimiento</label>
          <input
            v-model="birthDate"
            type="date"
            :max="maxDate"
            class="w-full border rounded p-2 mt-1 focus:ring-teal-400 focus:border-teal-400"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border rounded p-2 mt-1 focus:ring-teal-400 focus:border-teal-400"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Contraseña</label>
          <div
            class="relative mt-1 flex items-center w-full border rounded p-2 focus-within:ring-2 focus-within:ring-teal-400 focus-within:border-teal-400"
          >
            <input
              v-model="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              class="w-full border-none outline-none focus:ring-0"
              required
            />
            <span
              class="flex items-center pr-1 cursor-pointer text-gray-500 hover:text-gray-700"
              @click="isPasswordVisible = !isPasswordVisible"
            >
              <i
                :class="['pi', isPasswordVisible ? 'pi-eye-slash' : 'pi-eye']"
              ></i>
            </span>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Clínica</label>
          <select
            v-model="clinicId"
            class="w-full border rounded p-2 mt-1 focus:ring-teal-400 focus:border-teal-400"
            required
          >
            <option disabled value="">Selecciona una clínica</option>
            <option
              v-for="clinic in clinics"
              :key="clinic.id"
              :value="clinic.id"
            >
              {{ clinic.name }}
            </option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold shadow-md"
        >
          Crear cuenta
        </button>

        <p class="mt-4 text-center">
          ¿Ya tienes cuenta?
          <span
            class="text-teal-700 cursor-pointer font-semibold hover:underline"
            @click="goToLogin"
            >Inicia sesión</span
          >
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
const identificationTypeId = ref(1); // Valor por defecto
const clinicId = ref("");
const clinics = ref([]);

const maxDate = new Date().toISOString().split("T")[0];
const isPasswordVisible = ref(false);

onMounted(async () => {
  try {
    clinics.value = await clinicRepositoryImpl.getClinicsForRegister();
    if (clinics.value.length > 0) {
      clinicId.value = clinics.value[0].id; // Opcional: seleccionar la primera clínica por defecto
    }
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

<style scoped>
/* Estilos adicionales si fueran necesarios */
input:required:invalid {
  /* Opcional: marca los campos inválidos */
  /* border-color: #fca5a5; */
}
</style>
