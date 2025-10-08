import { itemPerServiceApi } from '../datasource/itemPerServiceApi.js';
import { ItemPerServiceMapper } from '../mappers/ItemPerServiceMapper.js';

export class ItemPerServiceRepositoryImpl {
    async getByServiceId(serviceId) {
        try {
            const raw = await itemPerServiceApi.getByServiceId(serviceId);
            return ItemPerServiceMapper.toDomainList(raw || []);
        } catch (error) {
            console.error('❌ Error fetching items-per-service:', error);
            throw error;
        }
    }
}

export const itemPerServiceRepositoryImpl = new ItemPerServiceRepositoryImpl();
