import { itemsApi } from '../datasource/itemsApi.js';
import { ItemMapper } from '../mappers/ItemMapper.js';

export class ItemsRepositoryImpl {
    async getAll() {
        try {
            const raw = await itemsApi.getAllItems();
            // raw should be an array of item resources
            return ItemMapper.toDomainList(raw || []);
        } catch (error) {
            console.error('❌ Error fetching items from API:', error);
            throw error;
        }
    }

}

export const itemsRepositoryImpl = new ItemsRepositoryImpl();
