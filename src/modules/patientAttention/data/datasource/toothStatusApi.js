import BaseService from '@/shared/services/BaseService.js';

class ToothStatusApi extends BaseService {
    constructor() {
        super('/patient-attention-service/api/v1/tooth-status');
    }

    async getAllToothStatuses() {
        return await this.get('');
    }
}

export const toothStatusApi = new ToothStatusApi();
