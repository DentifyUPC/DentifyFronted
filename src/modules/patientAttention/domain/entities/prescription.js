export class Prescription {
    constructor({
        id = null,
        effects = null,
    } = {}) {
        this.id = id;
        this.effects = effects;
    }

    get hasEffects() {
        return !!this.effects && this.effects.trim() !== '';
    }
}
