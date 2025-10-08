<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goHome = () => {
  router.push("/home");
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
    <h1 class="text-6xl font-bold text-red-500">404</h1>
    <p class="text-xl mt-4">Oops! The page you’re looking for doesn’t exist.</p>
    <pv-button class="mt-6" label="Go Home" icon="pi pi-home" @click="goHome" />
  </div>
</template>