import BaseService from "@/shared/services/baseService.js";

class ShiftApi extends BaseService {
    constructor() {
        super("/clinic-management-service/api/v1/shift");
    }

    async getAllByClinic(clinicId) {
        return this.get(`${clinicId}`);
    }

    async create(data) {
        return this.post("", data);
    }

    async update(shiftId, data) {
        return this.put(`${shiftId}`, data);
    }

    async delete(shiftId) {
        return super.delete(`${shiftId}`);
    }

}

export const shiftApi = new ShiftApi();