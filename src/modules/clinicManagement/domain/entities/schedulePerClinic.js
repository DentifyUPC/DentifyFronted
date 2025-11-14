export class SchedulePerClinic {
    constructor({
                    id = null,
                    startTime = null,
                    endTime = null,
                    clinicId = null,
                } = {}) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.clinicId = clinicId;
    }

    get isValid() {
        return !!(this.startTime && this.endTime && this.clinicId);
    }

    get duration() {
        if (!this.startTime || !this.endTime) return null;

        const start = this.parseTime(this.startTime);
        const end = this.parseTime(this.endTime);

        if (!start || !end) return null;

        let diffInMinutes = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);
        if (diffInMinutes < 0) diffInMinutes += 24 * 60;

        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        return `${hours}h ${minutes}m`;
    }

    parseTime(timeString) {
        if (!timeString) return null;

        const clean = timeString.trim();
        const match = clean.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
        if (!match) return null;

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = match[3] ? parseInt(match[3], 10) : 0;

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
            return null;
        }

        return { hours, minutes, seconds };
    }

    formatToHHmm(timeString) {
        if (!timeString) return '--:--';
        const parts = timeString.split(':');
        if (parts.length >= 2) {
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
        return timeString;
    }

    get formattedStartTime() {
        return this.formatToHHmm(this.startTime);
    }

    get formattedEndTime() {
        return this.formatToHHmm(this.endTime);
    }
}