import BaseService from '@/shared/serivces/BaseService.js';

class ProfileApi extends BaseService {
    constructor() {

        super('/iam-service/api/v1/profile');
    }

    async getProfile() {

        return await this.get('');
    }

    async updateInformation(data) {
        return await this.put('/update-information', data);
    }

    async updatePassword(data) {
        return await this.put('/update-password', data);
    }
}

export const profileApi = new ProfileApi();
