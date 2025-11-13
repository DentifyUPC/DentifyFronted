<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-[#AACFF3] p-0 m-0"
  >
    <div class="w-full h-screen flex flex-col lg:flex-row overflow-hidden">
      <section
        class="flex-1 bg-[#7DAEF9] flex items-center justify-center p-[clamp(1rem,3vw,3rem)]"
      >
        <div class="w-full max-w-[clamp(300px, 90%, 560px)]">
          <h1
            class="text-center font-extrabold mb-[clamp(1rem,3vw,2.5rem)] text-[#1e63c6]"
            :style="{ fontSize: 'clamp(1.4rem, 2.5vw, 2.6rem)' }"
          >
            Dentify - Login
          </h1>

          <form
            @submit.prevent="onLogin"
            class="w-full flex flex-col gap-[clamp(1rem,2.5vw,1.6rem)]"
          >
            <!-- Username -->
            <div>
              <label
                for="username"
                class="block text-left text-gray-800 font-medium"
                :style="{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)' }"
              >
                DNI
              </label>
              <input
                id="username"
                v-model.trim="username"
                type="text"
                autocomplete="username"
                placeholder="Ingresa tu DNI"
                class="w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                :style="{
                  fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                  padding: 'clamp(0.5rem, 1vw, 1rem)',
                }"
                required
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-left text-gray-800 font-medium"
                :style="{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)' }"
              >
                Password
              </label>
              <input
                id="password"
                v-model.trim="password"
                type="password"
                autocomplete="current-password"
                placeholder="Ingresa tu contraseña"
                class="w-full border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                :style="{
                  fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                  padding: 'clamp(0.5rem, 1vw, 1rem)',
                }"
                required
              />
            </div>

            <p
              v-if="authStore.errorMessage"
              class="text-red-700"
              :style="{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }"
            >
              {{ authStore.errorMessage }}
            </p>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-[#1e63c6] text-white font-semibold rounded-lg shadow-md hover:bg-[#1a53a1] transition-all duration-300 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#7DAEF9]"
              :style="{
                fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
                padding: 'clamp(0.6rem, 1.3vw, 1rem)',
              }"
            >
              {{ isSubmitting ? "Ingresando…" : "Iniciar sesión" }}
            </button>

            <!-- Registro -->
            <p
              class="text-center text-gray-900"
              :style="{ fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)' }"
            >
              ¿No tienes cuenta?
              <button
                type="button"
                class="text-[#1e63c6] font-semibold hover:underline"
                @click="goToRegister"
              >
                Regístrate
              </button>
            </p>

            <p
              v-if="authStore.error"
              class="text-red-700 text-center"
              :style="{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }"
            >
              {{ authStore.error }}
            </p>
          </form>
        </div>
      </section>

      <section
        class="hidden lg:flex flex-shrink-0 items-center justify-center bg-white h-full"
      >
        <img
          :src="heroUrl"
          alt="Clínica dental"
          class="w-[800px] h-full object-cover"
        />
      </section>
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
const isSubmitting = ref(false);
const heroUrl = ref(
  "https://www.clinicabmurri.com/wp-content/uploads/2020/07/tipos-dentistas.jpg"
);

const onLogin = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const ok = await authStore.login(username.value, password.value);
    if (ok) router.push("/home/profile");
  } catch (e) {
    console.error(e);
  } finally {
    isSubmitting.value = false;
  }
};

const goToRegister = () => router.push("/register");
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #aacff3;
  overflow: hidden;
}
</style>
