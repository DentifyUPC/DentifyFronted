export class UpdatePasswordUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository
    }

    async execute(payload) {
        return await this.authRepository.updatePassword(payload)
    }
}
