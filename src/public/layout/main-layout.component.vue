<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">

    <pv-toolbar
        class="w-full sticky top-0 z-40 flex items-center justify-between px-6 py-4 shadow-md backdrop-blur-md"
        style="background-color: rgba(170, 207, 243, 0.85); border-bottom: 1px solid #9ac8f0;"
    >

      <template #start>
        <div class="flex items-center gap-3">
          <button @click="goToProfile" class="flex items-center gap-2">
            <img
                src="@/assets/img/logo.png"
                alt="logo"
                class="w-[55px] md:w-[65px] transition-transform duration-300 hover:scale-105"
            />
            <span class="hidden md:inline text-lg font-semibold text-gray-800">Dentify</span>
          </button>
        </div>
      </template>


      <template #center>

        <div class="hidden md:flex flex-wrap items-center justify-center gap-2">
          <pv-button
              v-for="item in filteredMenu"
              :key="item.label"
              class="flex items-center rounded-xl px-3 py-2 font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
              style="background-color: transparent; color: #1e293b;"
              @click="goTo(item.route)"
          >
            <i :class="['pi', item.icon, 'mr-2 text-sky-600']"></i> {{ item.label }}
          </pv-button>
        </div>

        <button
            class="md:hidden text-2xl text-gray-700 transition-transform duration-200 hover:scale-110"
            @click="menuOpen = !menuOpen"
        >
          <i :class="menuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>
      </template>

      <template #end>
        <div class="flex items-center">
          <pv-button
              class="rounded-full px-3 py-3 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style="background-color: transparent; color: #1e293b; border: none;"
              @click="logout"
          >
            <i class="pi pi-sign-out text-xl"></i>
          </pv-button>
        </div>
      </template>
    </pv-toolbar>

    <transition name="fade">
      <div
          v-if="menuOpen"
          class="md:hidden flex flex-col bg-[#e6f1fb] border-t border-[#bcdcf9] shadow-md animate-fadeIn"
      >
        <button
            v-for="item in filteredMenu"
            :key="item.label"
            class="flex items-center gap-3 px-5 py-3 text-left text-gray-800 hover:bg-[#d8e9f9] transition-all duration-200"
            @click="goTo(item.route); menuOpen = false"
        >
          <i :class="['pi', item.icon, 'text-sky-600']"></i>
          {{ item.label }}
        </button>
      </div>
    </transition>


    <main class="flex-1 overflow-auto p-6 bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { TokenStorage } from "@/core/network/tokenStorage.js";

const router = useRouter();
const menuOpen = ref(false);

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

const menuConfig = {
  1: [
    { label: "Dashboard", route: "/home/admin-dashboard", icon: "pi-home" },
    { label: "Horarios", route: "/home/schedule-management", icon: "pi-clock" },
    { label: "Odontólogos", route: "/home/clinic-odontologist", icon: "pi-user" },
    { label: "Servicios", route: "/home/admin-services", icon: "pi-briefcase" },
    { label: "Inventario", route: "/home/admin-inventory", icon: "pi-box" },
    { label: "Pacientes", route: "/home/clinic-patients", icon: "pi-users" },
    { label: "Pagos", route: "/home/admin-payments", icon: "pi-dollar" },
    { label: "Perfil", route: "/home/profile", icon: "pi-user" },
  ],
  2: [
    { label: "Horarios", route: "/home/odontologist-schedule", icon: "pi-clock" },
    { label: "Citas", route: "/home/appointment-odontologist", icon: "pi-calendar" },
    { label: "Perfil", route: "/home/profile", icon: "pi-user" },
  ],
  3: [
    { label: "Citas", route: "/home/appointment-patients", icon: "pi-calendar"},
    { label: "Pagos", route: "/home/patient-payments", icon: "pi-credit-card" },
    { label: "Perfil", route: "/home/profile", icon: "pi-user" },
  ],
};

const filteredMenu = computed(() => {
  const roleId = user?.roleId;
  return menuConfig[roleId] || [];
});
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
