export class Odontologist {
    constructor({
                    id = null,
                    userId = null,
                    firstName = "",
                    lastName = "",
                    birthDate = null,
                    email = null,
                    gender = null,
                    phoneNumber = null,
                    clinicId = null,
                    professionalLicenseNumber = null,
                    specialty = null,
                    specialtyRegistrationNumber = null,
                    serviceId = null,
                    shiftName = null,
                    isActive = true,
                    age = null,
                    street = null,
                    district = null,
                    province = null,
                    department = null,
                } = {}) {
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.email = email;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.clinicId = clinicId;
        this.professionalLicenseNumber = professionalLicenseNumber;
        this.specialty = specialty;
        this.specialtyRegistrationNumber = specialtyRegistrationNumber;
        this.serviceId = serviceId;
        this.shiftName = shiftName;
        this.isActive = isActive;
        this.age = age;
        this.street = street;
        this.district = district;
        this.province = province;
        this.department = department;
    }

    get fullName() {
        return `${this.firstName || ""} ${this.lastName || ""}`.trim();
    }

    get fullAddress() {
        const parts = [this.street, this.district, this.province, this.department].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : null;
    }

    get isProfileComplete() {
        return Boolean(
            this.professionalLicenseNumber &&
            this.specialty &&
            this.serviceId &&
            this.shiftName &&
            this.phoneNumber &&
            this.gender
        );
    }

    get canTakeAppointments() {
        return this.isActive && this.isProfileComplete;
    }
}
