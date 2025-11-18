import BaseService from '@/shared/services/BaseService.js';

class AnamnesisApi extends BaseService {
    constructor() {
        super('/patient-attention-service/api/v1/anamnesis');
    }

    async getAnamnesis(anamnesisId) {
        return await this.get(`/${anamnesisId}`);
    }

    async updateAnamnesis(anamnesisId, data) {
        return await this.put(`/${anamnesisId}`, data);
    }
}

export const anamnesisApi = new AnamnesisApi();
