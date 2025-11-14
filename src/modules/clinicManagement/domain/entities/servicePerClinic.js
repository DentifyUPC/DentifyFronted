export class ServicePerClinic {
    constructor({
                    id = null,
                    clinicId = null,
                    serviceId = null,
                    name = '',
                    totalPricePerItems = 0,
                    totalLaborPrice = 0,
                    totalServicePrice = 0,
                } = {}) {
        this.id = id;
        this.clinicId = clinicId;
        this.serviceId = serviceId;
        this.name = name;
        this.totalPricePerItems = totalPricePerItems;
        this.totalLaborPrice = totalLaborPrice;
        this.totalServicePrice = totalServicePrice;
    }


    displayNameSC() {
        return this.name || `Servicio #${this.serviceId}`;
    }

    displayTotal() {
        return `${this.totalServicePrice?.toFixed(2) || 0} USD`;
    }
}
