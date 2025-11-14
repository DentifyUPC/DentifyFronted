export class Shift {
    constructor({
                    id = null,
                    startTime = null,
                    endTime = null,
                    name = null,
                    clinicId = null,
                } = {}) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.name = name;
        this.clinicId = clinicId;
    }

    get isValid() {
        return !!(this.startTime && this.endTime && this.name && this.clinicId);
    }

    get displayName() {
        const nameMap = {
            'MORNING': 'Mañana',
            'AFTERNOON': 'Tarde',
            'EVENING': 'Noche',
            'NIGHT': 'Madrugada',
        };
        return nameMap[this.name] || this.name;
    }

    get duration() {
        if (!this.startTime || !this.endTime) return null;

        const start = this.parseTime(this.startTime);
        const end = this.parseTime(this.endTime);

        if (!start || !end) return null;

        const diffInMinutes = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        return `${hours}h ${minutes}m`;
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

    get formattedStartTime() {
        return this.startTime || '--:--';
    }

    get formattedEndTime() {
        return this.endTime || '--:--';
    }

    get timeRange() {
        return `${this.formattedStartTime} - ${this.formattedEndTime}`;
    }
}