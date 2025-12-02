export class Payment {
    constructor({
                    id = null,
                    paymentDate = null,
                    amount = 0,
                    patientId = null,
                    state = 'PENDING',
                    appointmentId = null,
                    paypalOrderId = null,
                    paypalCaptureId = null,
                } = {}) {
        this.id = id;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.patientId = patientId;
        this.state = state;
        this.appointmentId = appointmentId;
        this.paypalOrderId = paypalOrderId;
        this.paypalCaptureId = paypalCaptureId;
    }

    get isValid() {
        return !!(
            this.patientId &&
            this.appointmentId &&
            this.amount > 0
        );
    }

    get isPending() {
        return this.state === 'PENDING';
    }

    get isPaid() {
        return this.state === 'PAID';
    }

    get isCancelled() {
        return this.state === 'CANCELLED';
    }

    get stateLabel() {
        const labels = {
            'PENDING': 'Pendiente',
            'PAID': 'Pagado',
            'CANCELLED': 'Cancelado',
        };
        return labels[this.state] || this.state;
    }

    get formattedAmount() {
        if (!this.amount) return 'S/. 0.00';
        return `S/. ${this.amount.toFixed(2)}`;
    }

    get formattedDate() {
        if (!this.paymentDate) return '--/--/----';
        return this.paymentDate;
    }

    get hasPayPalOrder() {
        return !!this.paypalOrderId;
    }

    get hasPayPalCapture() {
        return !!this.paypalCaptureId;
    }

    get canBePaid() {
        return this.isPending && this.amount > 0;
    }

    get displayStatus() {
        if (this.isPaid) {
            return {
                label: 'Pagado',
                color: 'bg-green-100 text-green-700',
                icon: 'pi-check-circle'
            };
        }
        if (this.isCancelled) {
            return {
                label: 'Cancelado',
                color: 'bg-red-100 text-red-700',
                icon: 'pi-times-circle'
            };
        }
        return {
            label: 'Pendiente',
            color: 'bg-yellow-100 text-yellow-700',
            icon: 'pi-clock'
        };
    }
}