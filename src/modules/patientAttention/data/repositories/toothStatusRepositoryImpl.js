import { toothStatusApi } from '../datasource/toothStatusApi.js';
import { ToothStatus } from '../../domain/entities/toothStatus.js';

export class ToothStatusRepositoryImpl {
    async getAll() {
        try {
            const raw = await toothStatusApi.getAllToothStatuses();
            return (raw || []).map((item) => new ToothStatus(item));
        } catch (error) {
            console.error('Error fetching tooth statuses:', error);
            throw error;
        }
    }
}

export const toothStatusRepositoryImpl = new ToothStatusRepositoryImpl();
