import { Payment } from "@/modules/payment/domain/entities/payment.js";

export class PaymentMapper {
    static toDomain(dto) {
        if (!dto) return null;

        console.log('🔍 PaymentMapper.toDomain - DTO recibido:', dto);

        return new Payment({
            id: dto.id,
            paymentDate: dto.paymentDate,
            amount: dto.amount,
            patientId: dto.patientId,
            state: dto.state,
            appointmentId: dto.appointmentId,
            paypalOrderId: dto.paypalOrderId,
            paypalCaptureId: dto.paypalCaptureId,
        });
    }

    static toDomainList(dtoList) {
        if (!Array.isArray(dtoList)) return [];
        return dtoList.map(dto => this.toDomain(dto));
    }

    static toDto(domain) {
        if (!domain) return null;

        return {
            id: domain.id,
            paymentDate: domain.paymentDate,
            amount: domain.amount,
            patientId: domain.patientId,
            state: domain.state,
            appointmentId: domain.appointmentId,
            paypalOrderId: domain.paypalOrderId,
            paypalCaptureId: domain.paypalCaptureId,
        };
    }

    static toUpdateAmountPayload(amount) {
        return {
            amount: amount,
        };
    }
}