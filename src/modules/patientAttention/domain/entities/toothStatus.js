export class ToothStatus {
    constructor({ id, name } = {}) {
        this.id = id;
        this.name = name;
    }

    displayName() {
        return this.name ?? '';
    }
}
