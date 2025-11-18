import { odontogramItemApi } from '../datasource/odontogramItemApi.js';
import { OdontogramItem } from '../../domain/entities/odontogramItem.js';

export class OdontogramItemRepositoryImpl {
    async getAllByOdontogramId(odontogramId) {
        try {
            const rawList = await odontogramItemApi.getAllByOdontogramId(odontogramId);
            return rawList ? rawList.map(item => new OdontogramItem(item)) : [];
        } catch (error) {
            console.error('Error fetching odontogram items:', error);
            throw error;
        }
    }

    async update(odontogramItemId, data) {
        try {
            const raw = await odontogramItemApi.update(odontogramItemId, data);
            return raw ? new OdontogramItem(raw) : null;
        } catch (error) {
            console.error('Error updating odontogram item:', error);
            throw error;
        }
    }
}

export const odontogramItemRepositoryImpl = new OdontogramItemRepositoryImpl();
