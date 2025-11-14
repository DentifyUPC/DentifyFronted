import BaseService from "@/shared/services/baseService.js";

class AppointmentApi extends BaseService {
    constructor() {
        super("/appointment-service/api/v1/appointment");
    }

    async getByPatientId(patientId) {
        return await this.get(`/patient/${patientId}`);
    }

    async getByOdontologistId(odontologistId) {
        return await this.get(`/odontologist/${odontologistId}`);
    }

    async create(payload) {
        return await this.post("", payload);
    }

    async update(id, payload) {
        return await this.put(`/${id}`, payload);
    }
}

export const appointmentApi = new AppointmentApi();
