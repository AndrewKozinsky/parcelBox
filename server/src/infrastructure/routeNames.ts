export const RouteNames = {
	AUTH: {
		REGISTER_ADMIN: 'auth_registerAdmin',
		REGISTER_SENDER: 'auth_registerSender',
		CONFIRM_EMAIL: 'auth_confirmEmail',
		LOGIN: 'auth_login',
		RESEND_CONFIRMATION_EMAIL: 'auth_resendConfirmationEmail',
		LOGOUT: 'auth_logout',
		GET_NEW_ACCESS_AND_REFRESH_TOKENS: 'auth_refreshToken',
		GET_ME: 'auth_getMe',
	},
	PARCEL_BOX_TYPE: {
		CREATE: 'parcelBoxType_create',
	},
	CELL_TYPE: {
		CREATE: 'cellType_create',
	},
	INIT_DATA: {
		SEED: 'initData/seed',
	},
	TESTING: {
		ALL_DATA: 'testing/all-data',
		SEED: 'testing/seed',
		USER: 'testing/user',
	},
}

export default RouteNames
