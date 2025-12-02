<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-[#2B6D8C] mb-8">
        📅 Mi Horario Semanal
      </h1>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <i class="pi pi-spin pi-spinner text-5xl text-[#2B6D8C]"></i>
        <span class="ml-4 text-gray-700 text-xl">Cargando horario...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg text-lg mb-6">
        <p class="font-bold">Error:</p>
        {{ error }}
      </div>

      <!-- Schedule Table -->
      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <!-- Table Header -->
            <thead>
              <tr class="bg-gradient-to-r from-[#2B6D8C] to-[#1E4F67] text-white">
                <th class="py-4 px-6 text-left font-bold text-lg border-r border-blue-900">
                  HORA
                </th>
                <th v-for="(day, idx) in daysOfWeek" :key="idx" class="py-4 px-6 text-center font-bold text-lg border-r border-blue-900">
                  <div class="flex flex-col">
                    <span class="text-base">{{ day.name }}</span>
                    <span class="text-xs font-normal">{{ day.date }}</span>
                  </div>
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody>
              <tr v-for="(row, rowIdx) in weeklySlots" :key="rowIdx" class="border-b border-gray-300">
                <!-- Time Slot -->
                <td class="py-3 px-4 font-bold text-gray-800 bg-gray-50 border-r border-gray-300 sticky left-0 z-5 text-base w-32 text-center">
                  {{ row.hour }}
                </td>

                <!-- Day Slots -->
                <td v-for="(slot, slotIdx) in row.slots" :key="slotIdx" class="py-2 px-2 border-r border-gray-300 align-top">
                  <!-- Appointment Card -->
                <div
                  v-if="slot.appointment"
                  class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded p-2 h-full min-h-[90px] shadow hover:shadow-md transition-all cursor-pointer"
                  @click="handleCellClick(slot)"
                  :title="`${slot.appointment.patientFullName} - ${slot.appointment.startTime}`"
                >
                  <div class="flex flex-col gap-1 h-full justify-center">
                    <!-- Patient Name -->
                    <p class="font-bold text-gray-800 text-xs leading-tight truncate">
                      👤 {{ slot.appointment.patientFullName }}
                    </p>

                    <!-- Time Range -->
                    <p class="text-xs font-semibold text-orange-700 truncate">
                      ⏰ {{ slot.appointment.startTime }} - {{ slot.appointment.endTime }}
                    </p>

                    <!-- Shift -->
                    <p class="text-xs text-gray-600 truncate">
                      🔖 {{ slot.appointment.shiftName }}
                    </p>

                    <!-- Status Badge -->
                    <div class="flex justify-center mt-1">
                      <span
                        class="px-2 py-0.5 rounded-full text-xs font-bold"
                        :class="{
                          'bg-yellow-100 text-yellow-700': slot.appointment.isPending,
                          'bg-green-100 text-green-700': slot.appointment.isAssisted,
                          'bg-red-100 text-red-700': slot.appointment.isCancelled
                        }"
                      >
                        {{ slot.appointment.stateLabel }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Empty Slot -->
                <div
                  v-else
                  class="bg-white border-2 border-dashed border-gray-300 rounded p-2 h-full min-h-[90px] flex items-center justify-center hover:border-gray-400 transition-all cursor-pointer"
                  @click="handleEmptySlotClick(row, slot)"
                >
                  <div class="text-center">
                    <p class="text-gray-400 text-xs font-semibold">✓ Disponible</p>
                  </div>
                </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/iam/stores/authStore.js";
import { odontologistRepositoryImpl } from "@/modules/practiceManagement/data/repositories/odontologistRepositoryImpl.js";
import { useAppointmentStore } from "@/modules/appointment/stores/appointmentStore.js";

const router = useRouter();
const authStore = useAuthStore();
const appointmentStore = useAppointmentStore();

// Estado
const isLoading = ref(true);
const error = ref(null);
const odontologistId = ref(null);
const weeklySlots = ref([]);
const daysOfWeek = ref([]);

// Debug - Mostrar todas las citas cargadas
const debugAppointments = computed(() => appointmentStore.appointments || []);

// Configuración
const startHour = 7;  // 8 am
const endHour = 22;   // 6 pm

// Get current week dates
function getWeekDates() {
  const today = new Date();
  const currentDay = today.getDay();
  const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(today.setDate(diff));

  const days = [];
  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  for (let i = 0; i < 6; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(currentDate.getDate() + i);
    days.push({
      name: dayNames[i],
      date: currentDate.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
      fullDate: currentDate
    });
  }

  return days;
}

// Crear estructura vacía
function buildEmptySchedule() {
  weeklySlots.value = [];
  daysOfWeek.value = getWeekDates();

  for (let h = startHour; h <= endHour; h++) {
    const row = {
      hour: `${h.toString().padStart(2, "0")}:00`,
      slots: []
    };

    for (let d = 0; d < daysOfWeek.value.length; d++) {
      row.slots.push({
        dayIndex: d,
        hour: h,
        appointment: null
      });
    }
    weeklySlots.value.push(row);
  }
}

// Insertar citas reales
function mapAppointments(appointments) {
  console.log("🔄 mapAppointments called with", appointments?.length || 0, "appointments");
  console.log("📋 daysOfWeek:", daysOfWeek.value);
  console.log("📋 All appointments:", appointments);
  
  if (!appointments || appointments.length === 0) {
    console.log("⚠️ No appointments to map");
    return;
  }

  appointments.forEach((apt) => {
    console.log("\n📍 Processing appointment:", {
      id: apt.id,
      patient: apt.patientFullName,
      date: apt.appointmentDate,
      startTime: apt.startTime,
      endTime: apt.endTime
    });

    // Parse date - handle multiple formats
    let dateObj = new Date(apt.appointmentDate);
    
    // If date is string in DD/MM/YYYY format, parse it manually
    if (typeof apt.appointmentDate === 'string' && apt.appointmentDate.includes('/')) {
      const [day, month, year] = apt.appointmentDate.split('/');
      dateObj = new Date(year, parseInt(month) - 1, day);
    }
    
    const weekday = dateObj.getDay(); // domingo=0
    
    console.log(`  📅 Date object: ${dateObj.toString()}`);
    console.log(`  🔢 Weekday: ${weekday} (0=Sun, 1=Mon, etc.)`);
    
    if (weekday === 0) {
      console.log("  ❌ Sunday - skipping");
      return;
    }

    const dayIndex = weekday - 1; // lunes=0
    console.log(`  📌 Day index: ${dayIndex} (0=Mon, 5=Sat)`);
    
    if (dayIndex < 0 || dayIndex > 5) {
      console.log("  ❌ Invalid day index");
      return;
    }

    // Normalizar hora
    const timeMatch = apt.startTime.match(/(\d+):(\d+)/);
    if (!timeMatch) {
      console.log(`  ❌ Invalid time format: ${apt.startTime}`);
      return;
    }
    
    const aptHour = parseInt(timeMatch[1]);
    console.log(`  ⏰ Appointment hour: ${aptHour}`);

    const targetRow = weeklySlots.value.find(
        (r) => parseInt(r.hour.split(":")[0]) === aptHour
    );

    if (!targetRow) {
      console.log(`  ❌ No time slot found for hour ${aptHour} (available: ${startHour}-${endHour})`);
      return;
    }

    const slot = targetRow.slots[dayIndex];
    if (!slot) {
      console.log(`  ❌ No slot at day index ${dayIndex}`);
      return;
    }

    console.log(`  ✅ MAPPED! Patient ${apt.patientFullName} at ${apt.appointmentDate} ${apt.startTime}`);
    slot.appointment = apt;
  });
}

// Click handlers
function handleCellClick(slot) {
  router.push("/home/appointment-odontologist");
}

function handleEmptySlotClick(row, slot) {
  // Can add logic to create new appointment
  router.push("/home/appointment-odontologist");
}

// Carga inicial
onMounted(async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) throw new Error("No se encontró el usuario");

    const odontologist = await odontologistRepositoryImpl.getProfile(userId);
    odontologistId.value = odontologist.id;

    await appointmentStore.fetchByOdontologistId(odontologistId.value);

    const appointments = appointmentStore.appointments;

    buildEmptySchedule();
    mapAppointments(appointments);

  } catch (err) {
    error.value = err.message;
    console.error("Error:", err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
table {
  border-collapse: collapse;
}

td {
  vertical-align: top;
}

/* Sticky header */
thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Sticky first column */
td:first-child {
  position: sticky;
  left: 0;
  z-index: 5;
}
</style>
