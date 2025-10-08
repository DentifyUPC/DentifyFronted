export class Odontologist {
    constructor({
                    id = null,
                    userId = null,
                    firstName = '',
                    lastName = '',
                    birthDate = null,
                    email = null,
                    gender = null,
                    phoneNumber = null,
                    clinicId = null,
                    professionalLicenseNumber = null,
                    specialty = null,
                    specialtyRegistrationNumber = null,
                    serviceId = null,
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
        this.isActive = isActive;
        this.age = age;
        this.street = street;
        this.district = district;
        this.province = province;
        this.department = department;
    }

    get fullName() {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
}
