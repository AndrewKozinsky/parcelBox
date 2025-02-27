import { AuthResolver } from '../../routes/auth/auth.resolver'

export const errorMessage = {
	// EMAIL
	emailIsAlreadyRegistered: 'Email is already registered',
	emailIsNotConfirmed: 'Email is not confirmed',
	emailIsAlreadyConfirmed: 'Email is already confirmed',
	emailConfirmationCodeIsExpired: 'Email confirmation code is expired',
	emailConfirmationCodeNotFound: 'Email confirmation code not found',
	emailOrPasswordDoNotMatch: 'Email or passwords do not match',
	emailNotFound: 'Email is not found',
	// USER
	userNotFound: 'User not found',
	// AUTH
	refreshTokenIsNotValid: 'Refresh token is not valid',
	accessTokenIsNotValid: 'Access token is not valid',
	// RefreshTokenIsNotFound = 'Refresh token is not found',
	// UserDoesNotOwnThisDeviceToken = 'User does not own this device token',
	// UserDeviceNotFound = 'User device not found',
	unknownDbError: 'Unknown error in database',
}
