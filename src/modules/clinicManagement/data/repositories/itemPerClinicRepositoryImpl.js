import { itemPerClinicApi } from '../datasource/itemPerClinicApi.js';
import { ItemPerClinicMapper } from '../mappers/ItemPerClinicMapper.js';

export class ItemPerClinicRepositoryImpl {
    async getByClinicId(clinicId) {
        try {
            const raw = await itemPerClinicApi.getByClinicId(clinicId);
            console.log('📦 Respuesta cruda del backend (items per clinic):', raw);
            return ItemPerClinicMapper.toDomainList(raw);
        } catch (error) {
            console.error('❌ Error fetching items-per-clinic:', error);
            throw error;
        }
    }


    async create(data) {
        try {
            const raw = await itemPerClinicApi.create(data);
            return ItemPerClinicMapper.toDomain(raw);
        } catch (error) {
            console.error('❌ Error creating item-per-clinic:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const raw = await itemPerClinicApi.update(id, data);
            return ItemPerClinicMapper.toDomain(raw);
        } catch (error) {
            console.error('❌ Error updating item-per-clinic:', error);
            throw error;
        }
    }

    async save(itemPerClinic) {
        const payload = ItemPerClinicMapper.toPersistence(itemPerClinic);
        console.log('📤 Payload a enviar:', payload);
        return await this.post('', payload);
    }


}

export const itemPerClinicRepositoryImpl = new ItemPerClinicRepositoryImpl();
