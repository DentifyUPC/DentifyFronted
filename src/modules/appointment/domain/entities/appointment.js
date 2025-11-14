export class Appointment {
    constructor({
                    id = null,
                    state = 'PENDING',
                    patientId = null,
                    odontologistId = null,
                    startTime = null,
                    endTime = null,
                    appointmentDate = null,
                    shiftName = null,
                    clinicId = null,
                    patientFirstName = null,
                    patientLastName = null,
                } = {}) {
        this.id = id;
        this.state = state;
        this.patientId = patientId;
        this.odontologistId = odontologistId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.appointmentDate = appointmentDate;
        this.shiftName = shiftName;
        this.clinicId = clinicId;
        this.patientFirstName = patientFirstName;
        this.patientLastName = patientLastName;
    }

    get isValid() {
        return !!(
            this.patientId &&
            this.odontologistId &&
            this.startTime &&
            this.endTime &&
            this.appointmentDate &&
            this.shiftName &&
            this.clinicId
        );
    }

    get isPending() {
        return this.state === 'PENDING';
    }

    get isAssisted() {
        return this.state === 'ASSISTED';
    }

    get isAbsent() {
        return this.state === 'ABSENT';
    }

    get stateLabel() {
        const labels = {
            'PENDING': 'Pendiente',
            'ASSISTED': 'Asistio',
            'ABSENT': 'Ausente',
        };
        return labels[this.state] || this.state;
    }

    get formattedDate() {
        if (!this.appointmentDate) return '--/--/----';
        return this.appointmentDate;
    }

    get formattedStartTime() {
        return this.startTime || '--:--';
    }

    get formattedEndTime() {
        return this.endTime || '--:--';
    }

    get timeRange() {
        return `${this.formattedStartTime} - ${this.formattedEndTime}`;
    }

    get patientFullName() {
        if (this.patientFirstName && this.patientLastName) {
            return `${this.patientFirstName} ${this.patientLastName}`;
        }
        return `Paciente #${this.patientId}`;
    }

    get duration() {
        if (!this.startTime || !this.endTime) return null;

        const start = this.parseTime(this.startTime);
        const end = this.parseTime(this.endTime);

        if (!start || !end) return null;

        const diffInMinutes = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    }

    parseTime(timeString) {
        if (!timeString) return null;
        const parts = timeString.split(':');
        if (parts.length !== 2) return null;
        return {
            hours: parseInt(parts[0], 10),
            minutes: parseInt(parts[1], 10)
        };
    }
}