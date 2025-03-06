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

	// PARCEL BOX TYPE
	parcelBoxTypeDidNotCreated: 'Тип посыльного ящика не создан.',
	parcelBoxTypeDoesNotExist: 'Тип посыльного ящика не найден.',

	// CELL BOX TYPE
	cellTypeDidNotCreated: 'Тип ячейки не создан.',

	// INPUT DATA
	wrongInputData: 'Неверные значения полей.',
	minCharacters(num: number) {
		return 'Минимальное количество символов: ' + num
	},
	maxCharacters(num: number) {
		return 'Максимальное количество символов: ' + num
	},
	minNum(num: number) {
		return 'Минимальное число: ' + num
	},
	maxNum(num: number) {
		return 'Максимальное число: ' + num
	},

	// MICK
	unknownDbError: 'Неизвестная ошибка в базе данных.',
	onlyDevMode: 'It works only in development mode.',
}
