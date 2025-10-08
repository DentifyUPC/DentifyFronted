export class RegisterPatient {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute(data) {
        return await this.authRepository.registerPatient(data);
    }
}
