export class UpdateProfileUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository
    }

    async execute(payload) {
        return await this.authRepository.updateProfile(payload)
    }
}
