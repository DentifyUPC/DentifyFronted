<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
  >
    <div
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl mx-4 p-8 animate-fadeIn overflow-y-auto max-h-[90vh] flex flex-col"
    >
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        aria-label="Cerrar"
      >
        <i class="pi pi-times text-xl"></i>
      </button>

      <h2 class="text-2xl font-semibold text-teal-700 mb-6 text-center">
        {{ patient ? "Actualizar información..." : "Completar información..." }}
      </h2>

      <form @submit.prevent="handleUpdate" class="flex flex-col flex-grow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 flex-grow">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Departamento</label>
            <select
              v-model="selectedDepartment"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 bg-white"
              required
            >
              <option :value="null" disabled>-- Selecciona --</option>
              <option v-for="dep in departments" :key="dep" :value="dep">
                {{ dep }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Provincia</label>
            <select
              v-model="selectedProvince"
              :disabled="!selectedDepartment || provinces.length === 0"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 disabled:bg-gray-100 bg-white"
              required
            >
              <option :value="null" disabled>-- Selecciona --</option>
              <option v-for="prov in provinces" :key="prov" :value="prov">
                {{ prov }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Distrito</label>
            <select
              v-model="selectedDistrict"
              :disabled="!selectedProvince || districts.length === 0"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 disabled:bg-gray-100 bg-white"
              required
            >
              <option :value="null" disabled>-- Selecciona --</option>
              <option v-for="dist in districts" :key="dist" :value="dist">
                {{ dist }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Calle</label>
            <input
              v-model="form.street"
              type="text"
              placeholder="Ej. Av. Primavera 123"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Género</label>
            <select
              v-model="form.gender"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 bg-white"
            >
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Femenino</option>
            </select>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1">Teléfono</label>
            <input
              v-model="form.phoneNumber"
              type="text"
              placeholder="Número de teléfono (9 dígitos)"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400"
              maxlength="9"
              aria-describedby="phone-error"
            />
            <div id="phone-error" class="min-h-[1.25rem] mt-1">
              <p v-if="phoneNumberError" class="text-red-500 text-xs">
                {{ phoneNumberError }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <PvButton
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            @click="$emit('close')"
            class="bg-gray-400 border-none hover:bg-gray-500 text-white px-5 py-2"
          />
          <PvButton
            type="submit"
            label="Guardar cambios"
            icon="pi pi-check"
            class="bg-teal-600 border-none hover:bg-teal-700 text-white px-5 py-2"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { patientRepositoryImpl } from "@/modules/patientAttention/data/repositories/patientRepositoryImpl.js";
import ubigeoData from "@/data/ubigeo-peru.json";

const props = defineProps({
  patient: { type: Object, default: null },
  userProfile: { type: Object, required: true },
});
const emit = defineEmits(["close", "updated"]);

const form = ref({
  gender: "",
  street: "",
  district: "",
  department: "",
  province: "",
  phoneNumber: "",
});

const phoneNumberError = ref("");
const isPhoneNumberValid = computed(() => {
  const phone = form.value.phoneNumber ? form.value.phoneNumber.trim() : "";
  return /^\d{9}$/.test(phone);
});

const ubigeo = ref([]);
const departments = ref([]);
const provinces = ref([]);
const districts = ref([]);
const selectedDepartment = ref(null);
const selectedProvince = ref(null);
const selectedDistrict = ref(null);

onMounted(async () => {
  ubigeo.value = ubigeoData;
  departments.value = ubigeoData.map((dep) => dep.departamento).sort();
  if (props.patient) {
    form.value.gender = props.patient.gender || "";
    form.value.street = props.patient.street || "";
    form.value.phoneNumber = props.patient.phoneNumber || "";
    if (props.patient.department) {
      selectedDepartment.value = props.patient.department;
      await nextTick();
      if (
        props.patient.province &&
        provinces.value.includes(props.patient.province)
      ) {
        selectedProvince.value = props.patient.province;
        await nextTick();
        if (
          props.patient.district &&
          districts.value.includes(props.patient.district)
        ) {
          selectedDistrict.value = props.patient.district;
        } else {
          selectedDistrict.value = null;
        }
      } else {
        selectedProvince.value = null;
        selectedDistrict.value = null;
      }
    }
  }
});

watch(selectedDepartment, (newDepartment) => {
  selectedProvince.value = null;
  selectedDistrict.value = null;
  provinces.value = [];
  districts.value = [];
  form.value.department = newDepartment;
  if (newDepartment) {
    const depData = ubigeo.value.find((d) => d.departamento === newDepartment);
    if (depData) {
      provinces.value = depData.provincias.map((p) => p.provincia).sort();
    }
  }
});

watch(selectedProvince, (newProvince) => {
  selectedDistrict.value = null;
  districts.value = [];
  form.value.province = newProvince;
  if (newProvince && selectedDepartment.value) {
    const depData = ubigeo.value.find(
      (d) => d.departamento === selectedDepartment.value
    );
    const provData = depData?.provincias.find(
      (p) => p.provincia === newProvince
    );
    if (provData) {
      districts.value = [...provData.distritos].sort();
    }
  }
});

watch(selectedDistrict, (newDistrict) => {
  form.value.district = newDistrict;
});

const handleUpdate = async () => {
  phoneNumberError.value = "";
  const phoneTrimmed = form.value.phoneNumber
    ? form.value.phoneNumber.trim()
    : "";
  const isValidPhone = /^\d{9}$/.test(phoneTrimmed);
  if (!isValidPhone) {
    phoneNumberError.value =
      "El número de teléfono debe contener exactamente 9 dígitos.";
    // Quitamos el alert()
    return;
  }
  if (
    !selectedDepartment.value ||
    !selectedProvince.value ||
    !selectedDistrict.value
  ) {
    alert("Por favor, selecciona Departamento, Provincia y Distrito.");
    return;
  }
  form.value.department = selectedDepartment.value;
  form.value.province = selectedProvince.value;
  form.value.district = selectedDistrict.value;
  try {
    const patientId = props.patient?.id;
    if (!patientId) {
      alert("No se encontró el ID del paciente.");
      return;
    }
    const payload = { ...form.value };
    await patientRepositoryImpl.updateProfile(patientId, payload);
    emit("updated");
    alert("Información actualizada ✅");
    emit("close");
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    alert("Ocurrió un error al guardar.");
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
