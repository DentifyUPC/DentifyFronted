<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-teal-700">Dentify - Login</h1>

      <form @submit.prevent="onLogin">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input v-model="username" type="text" class="w-full border rounded p-2 mt-1" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full border rounded p-2 mt-1" required />
        </div>

        <p v-if="authStore.errorMessage" class="text-red-500 text-sm mb-2">
          {{ authStore.errorMessage }}
        </p>

        <button type="submit" class="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition">
          Iniciar sesión
        </button>

        <p class="mt-4 text-center">
          ¿No tienes cuenta?
          <span class="text-teal-700 cursor-pointer" @click="goToRegister">Regístrate</span>
        </p>
      </form>

      <p v-if="authStore.error" class="text-red-500 mt-3 text-center text-sm font-medium">
        {{ authStore.error }}
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");

const onLogin = async () => {
  const success = await authStore.login(username.value, password.value);
  if (success) router.push("/home/profile");

};

const goToRegister = () => router.push("/register");
</script>
