import BaseService from '@/shared/serivces/baseService.js';

class AuthApi extends BaseService {
    constructor() {
        super('/auth');
    }

    async login(username, password) {
        return await this.post('/login', { username, password });
    }

    async registerPatient(payload) {
        return await this.post('/register', payload, false);
    }

}

export const authApi = new AuthApi();
