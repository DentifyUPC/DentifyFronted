import BaseService from "@/shared/services/baseService.js";

class OdontogramItemApi extends BaseService {
    constructor() {
        super("/patient-attention-service/api/v1/odontogram-item");
    }

    getAllByOdontogramId(odontogramId) {
        return this.get(`odontogram-id/${odontogramId}`);
    }

    update(odontogramItemId, data) {
        return this.put(`${odontogramItemId}`, data);
    }
}

export const odontogramItemApi = new OdontogramItemApi();
