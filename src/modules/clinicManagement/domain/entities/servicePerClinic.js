export class ServicePerClinic {
    constructor({
                    id = null,
                    clinicId = null,
                    serviceId = null,
                    totalPricePerItems = 0,
                    totalLaborPrice = 0,
                    totalServicePrice = 0,
                } = {}) {
        this.id = id;
        this.clinicId = clinicId;
        this.serviceId = serviceId;
        this.totalPricePerItems = totalPricePerItems;
        this.totalLaborPrice = totalLaborPrice;
        this.totalServicePrice = totalServicePrice;
    }
}
