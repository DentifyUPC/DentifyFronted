import { odontologistApi } from '../datasource/odontologistApi.js'; // ajusta ruta
import { Odontologist } from '@/modules/practiceManagement/domain/entities/odontologist.js';

export const odontologistRepositoryImpl = {
    async getProfile(userId) {
        try {
            const data = await odontologistApi.getByUserId(userId);

            return new Odontologist({
                id: data.id,
                userId: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                birthDate: data.birthDate,
                email: data.email,
                gender: data.gender,
                phoneNumber: data.phoneNumber,
                clinicId: data.clinicId,
                professionalLicenseNumber: data.professionalLicenseNumber,
                specialty: data.specialty,
                specialtyRegistrationNumber: data.specialtyRegistrationNumber,
                serviceId: data.serviceId,
                isActive: data.isActive,
                age: data.age,
                street: data.street,
                district: data.district,
                province: data.province,
                department: data.department
            });
        } catch (error) {
            console.error('❌ odontologistRepositoryImpl.getProfile error:', error);
            throw error;
        }
    },

    async updateProfile(odontologistId, payload) {
        const data = await odontologistApi.updateOdontologist(odontologistId, payload);
        return new Odontologist(data);
    },

    async getAllByClinic(clinicId) {
        const arr = await odontologistApi.getByClinicId(clinicId);
        return arr.map(a => new Odontologist(a));
    }
};
