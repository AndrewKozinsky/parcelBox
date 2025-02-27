export const errorMessage = {
	// EMAIL
	emailIsAlreadyRegistered: 'Почта уже зарегистрирована.',
	emailIsNotConfirmed: 'Почта зарегистрирована, но не подтверждена.',
	emailIsAlreadyConfirmed: 'Почта уже подтверждена.',
	emailConfirmationCodeIsExpired: 'Срок действия кода подтверждения почты истек.',
	emailConfirmationCodeNotFound: 'Код подтверждения почты не найден.',
	emailOrPasswordDoNotMatch: 'Почта и пароль не совпадают.',
	emailNotFound: 'Почта не найдена.',
	// USER
	userNotFound: 'Пользователь не найден.',
	// AUTH
	refreshTokenIsNotValid: 'Токен обновления недействителен.',
	accessTokenIsNotValid: 'Токен доступа недействителен.',
	// RefreshTokenIsNotFound = 'Refresh token is not found',
	// UserDoesNotOwnThisDeviceToken = 'User does not own this device token',
	// UserDeviceNotFound = 'User device not found',
	unknownDbError: 'Неизвестная ошибка в базе данных.',
	wrongInputData: 'Неверные значения полей.',
	minNumberOfCharacters(num: number) {
		return 'Минимальное количество символов: ' + num
	},
	maxNumberOfCharacters(num: number) {
		return 'Максимальное количество символов: ' + num
	},
}
