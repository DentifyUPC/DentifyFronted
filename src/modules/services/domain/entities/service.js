export class Service {
    constructor({ id = null, name = '' } = {}) {
        this.id = id;
        this.name = name;
    }

    displayName() {
        return this.name ?? '';
    }
}
