export const routeNames = {
	main: {
		name: 'Главная',
		path: '/',
	},
	auth: {
		name: 'Авторизация',
		path: '/auth',
		login: {
			name: 'Вход',
			path: '/auth/login',
		},
		register: {
			name: 'Регистрация',
			path: '/auth/register',
		},
		rememberPassword: {
			name: 'Вспомнить пароль',
			path: '/auth/forget-password',
		},
		emailConfirmation: {
			name: 'Подтверждение эл. почты',
			path: '/auth/email-confirmation',
		},
		resendConfirmationLetter: {
			name: 'Повторная отправка письма подтверждения почты',
			path: '/auth/resend-confirmation-letter',
		},
	},
	admin: {
		name: 'Главная',
		path: '/a',
	},
	sender: {
		name: 'Главная',
		path: '/s',
	},
}
