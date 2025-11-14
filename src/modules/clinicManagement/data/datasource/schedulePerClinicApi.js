import BaseService from "@/shared/services/baseService.js";

class SchedulePerClinicApi extends BaseService {
    constructor() {
        super("/clinic-management-service/api/v1/schedule-per-clinic");
    }

    async getByClinicId(clinicId) {
        return await this.get(`/${clinicId}`);
    }

    async create(payload) {
        return await this.post("", payload);
    }

    async update(id, payload) {
        return await this.put(`/${id}`, payload);
    }
}

export const schedulePerClinicApi = new SchedulePerClinicApi();
