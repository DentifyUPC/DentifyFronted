import BaseService from '@/shared/serivces/BaseService.js';

class ClinicApi extends BaseService {
    constructor() {
        // No le pasamos prefijo al constructor
        super(''); 
    }

    async getClinicsForRegister() {
        // Ponemos la URL completa que SÍ funciona en Swagger
        return await this.get('/clinics/clinics-information-pre-register'); 
    }
}

export const clinicApi = new ClinicApi();