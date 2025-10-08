import { servicesApi } from '../datasource/serviceApi.js';
import { ServiceMapper } from '../mappers/ServiceMapper.js';

export class ServicesRepositoryImpl {
    async getAll() {
        try {
            const raw = await servicesApi.getAllServices();
            return ServiceMapper.toDomainList(raw || []);
        } catch (error) {
            console.error('❌ Error fetching services:', error);
            throw error;
        }
    }
}

export const servicesRepositoryImpl = new ServicesRepositoryImpl();
