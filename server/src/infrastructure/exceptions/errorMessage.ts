export const errorMessage = {
	// EMAIL
	emailIsAlreadyRegistered: 'Почта уже зарегистрирована.',
	emailIsNotConfirmed: 'Почта уже зарегистрирована, но не подтверждена.',
	emailIsAlreadyConfirmed: 'Email is already confirmed.',
	emailConfirmationCodeIsExpired: 'Email confirmation code is expired.',
	emailConfirmationCodeNotFound: 'Email confirmation code not found.',
	emailOrPasswordDoNotMatch: 'Email or passwords do not match.',
	emailNotFound: 'Email is not found.',
	// USER
	userNotFound: 'User not found.',
	// AUTH
	refreshTokenIsNotValid: 'Refresh token is not valid.',
	accessTokenIsNotValid: 'Access token is not valid.',
	// RefreshTokenIsNotFound = 'Refresh token is not found',
	// UserDoesNotOwnThisDeviceToken = 'User does not own this device token',
	// UserDeviceNotFound = 'User device not found',
	unknownDbError: 'Unknown error in database.',
	wrongInputData: 'Неверные значения полей.',
	minNumberOfCharacters(num: number) {
		return 'Минимальное количество символов: ' + num
	},
	maxNumberOfCharacters(num: number) {
		return 'Максимальное количество символов: ' + num
	},
}
