import { Appointment } from "@/modules/appointment/domain/entities/appointment.js";

export class AppointmentMapper {
    static toDomain(dto) {
         if (!dto) return null;
         
         console.log('🔍 AppointmentMapper.toDomain - DTO recibido:', dto);

         return new Appointment({
             id: dto.id,
             state: dto.state,
             patientId: dto.patientId,
             odontologistId: dto.odontologistId,
             startTime: dto.startTime,
             endTime: dto.endTime,
             appointmentDate: dto.appointmentDate,
             shiftName: dto.shiftName,
             clinicId: dto.clinicId,
             patientFirstName: dto.patientFirstName,
             patientLastName: dto.patientLastName,
         });
     }

    static toDomainList(dtoList) {
        if (!Array.isArray(dtoList)) return [];
        return dtoList.map(dto => this.toDomain(dto));
    }

    static toDto(domain) {
        if (!domain) return null;

        return {
            state: domain.state,
            patientId: domain.patientId,
            odontologistId: domain.odontologistId,
            startTime: domain.startTime,
            endTime: domain.endTime,
            appointmentDate: domain.appointmentDate,
            shiftName: domain.shiftName,
            clinicId: domain.clinicId,
        };
    }

    static toCreatePayload(data) {
        return {
            patientId: data.patientId,
            odontologistId: data.odontologistId,
            startTime: data.startTime,
            endTime: data.endTime,
            appointmentDate: data.appointmentDate,
            shiftName: data.shiftName,
            clinicId: data.clinicId,
        };
    }

    static toUpdatePayload(data) {
        return {
            state: data.state,
        };
    }
}