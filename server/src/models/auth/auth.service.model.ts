export type UserServiceModel = {
	id: number
	email: string
	password: string
	emailConfirmationCode: string | null
	confirmationCodeExpirationDate: string | null
	isEmailConfirmed: boolean
}
