<template>
  <div class="min-h-screen flex flex-col">
    <pv-toolbar
        class="w-full fixed top-0 left-0 flex items-center justify-between p-4"
        style="background-color: #AACFF3; border: 2px solid #AACFF3;"
    >

      <!-- Logo -->
      <template #start>
        <pv-button
            class="rounded-lg text-lg px-6 py-3 flex items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            style="background-color: #AACFF3; color: #AACFF3; border: 2px solid #AACFF3;"
            @click="goToProfile"
        >
          <img src="@/assets/img/logo.png" class="w-[60px]" alt="logo" />
        </pv-button>
      </template>



      <template #center>
        <div class="flex items-center">
          <pv-button
              v-for="item in filteredMenu"
              :key="item.label"
              class="mx-2 flex items-center rounded-lg px-3 py-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-md"
              style="background-color: #AACFF3; color: black;"
              @click="goTo(item.route)"
          >
            <i :class="['pi', item.icon, 'mr-2']"></i> {{ item.label }}
          </pv-button>
        </div>
      </template>

      <!-- End actions -->
      <template #end>
        <div class="flex items-center">

          <pv-button
              class="mx-2 rounded-lg text-lg px-2 py-3 transition-all duration-300 hover:scale-110 hover:shadow-md"
              style="background-color: #AACFF3; color: black; border: 2px solid #AACFF3;"
              @click="logout"
          >
            <i class="pi pi-sign-out"></i>
          </pv-button>
        </div>
      </template>
    </pv-toolbar>

    <main class="flex-1 p-6 bg-gray-50 overflow-auto mt-[80px]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { TokenStorage } from "@/core/network/tokenStorage.js";

const router = useRouter();
const goTo = (path) => router.push(path);

const logout = () => {
  TokenStorage.clearAccessToken();
  localStorage.removeItem("user");
  router.replace("/login");
};
const goToProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return router.push("/login");

  switch (user.roleId) {
    case 1:
      router.push("/home/admin-profile");
      break;
    case 2:
      router.push("/home/odontologist-profile");
      break;
    case 3:
      router.push("/home/patient-profile");
      break;
    default:
      router.push("/home/profile");
  }
};


const user = JSON.parse(localStorage.getItem("user") || "{}");

// 🧩 Menús base
const menuConfig = {
  1: [ //Administrador
    { label: "Dashboard", route: "/home/dashboard", icon: "pi-home" },
    { label: "Horarios", route: "/home/schedules", icon: "pi-clock" },
    { label: "Odontólogos", route: "/home/clinic-odontologist", icon: "pi-user" },
    { label: "Servicios", route: "/home/admin-services", icon: "pi-briefcase" },
    { label: "Inventario", route: "/home/admin-inventory", icon: "pi-box" },
    { label: "Pacientes", route: "/home/patients", icon: "pi-users" },
    { label: "Pagos", route: "/home/payments", icon: "pi-dollar" },
    { label: "Perfil", route: "/home/profile", icon: "pi-user" },
  ],
  2: [ //Odontólogo
    { label: "Horarios", route: "/home/schedules", icon: "pi-clock" },
    { label: "Citas", route: "/home/appointments", icon: "pi-calendar" },
    { label: "Perfil", route: "/home/profile", icon: "pi-user" },
  ],
  3: [ //Paciente

    { label: "Horarios", route: "/home/schedules", icon: "pi-clock" },
    { label: "Citas", route: "/home/appointments", icon: "pi-calendar" },
    { label: "Pagos", route: "/home/payments", icon: "pi-credit-card" },
    { label: "Perfil", route: "/home/profile", icon: "pi-user" },
  ],
};


const filteredMenu = computed(() => {
  const roleId = user?.roleId;
  return menuConfig[roleId] || [];
});
</script>
