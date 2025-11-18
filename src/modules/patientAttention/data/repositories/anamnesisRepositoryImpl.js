import { anamnesisApi } from '../datasource/anamnesisApi.js';
import { Anamnesis } from '../../domain/entities/anamnesis.js';

export class AnamnesisRepositoryImpl {
    async getById(anamnesisId) {
        try {
            const raw = await anamnesisApi.getAnamnesis(anamnesisId);
            return raw ? new Anamnesis(raw) : null;
        } catch (error) {
            console.error('Error fetching anamnesis:', error);
            throw error;
        }
    }

    async update(anamnesisId, data) {
        try {
            const raw = await anamnesisApi.updateAnamnesis(anamnesisId, data);
            return raw ? new Anamnesis(raw) : null;
        } catch (error) {
            console.error('Error updating anamnesis:', error);
            throw error;
        }
    }
}

export const anamnesisRepositoryImpl = new AnamnesisRepositoryImpl();
