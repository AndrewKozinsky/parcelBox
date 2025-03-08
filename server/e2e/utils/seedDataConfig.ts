import { UserRole } from '../../src/db/dbConstants'

type UserConfig = {
	// Initially user id is null.
	// When he was created number was set here.
	id: null | number
	role: UserRole
	password: string
	confirmed: boolean
	login: boolean
}

type UsersConfig = Record<string, UserConfig>

const usersConfig = {
	'admin-1@email.com': {
		id: null,
		role: UserRole.Admin,
		password: 'adminPassword-1',
		confirmed: false,
		login: false,
	},
	'admin-2Conf@email.com': {
		id: null,
		role: UserRole.Admin,
		password: 'adminPassword-2',
		confirmed: true,
		login: false,
	},
	'admin-3ConfLog@email.com': {
		id: null,
		role: UserRole.Admin,
		password: 'adminPassword-3',
		confirmed: true,
		login: true,
	},
	'sender-1@email.com': {
		id: null,
		role: UserRole.Sender,
		password: 'senderPassword-1',
		confirmed: false,
		login: false,
	},
	'sender-2@email.com': {
		id: null,
		role: UserRole.Sender,
		password: 'senderPassword-2',
		confirmed: false,
		login: false,
	},
	'sender-3-Conf@email.com': {
		id: null,
		role: UserRole.Sender,
		password: 'senderPassword-3',
		confirmed: true,
		login: false,
	},
	'sender-4-ConfLog@email.com': {
		id: null,
		role: UserRole.Sender,
		password: 'senderPassword-4',
		confirmed: true,
		login: true,
	},
	'sender-5-ConfLog@email.com': {
		id: null,
		role: UserRole.Sender,
		password: 'senderPassword-5',
		confirmed: true,
		login: true,
	},
} satisfies UsersConfig

type UserParcelBoxConfig = Record<string, number>

type ParcelBoxesConfig = Record<string, UserParcelBoxConfig>

export const seedDataConfig = {
	getUsersConfig(): UsersConfig {
		return usersConfig
	},
	getUsersParcelBoxesConfig(): ParcelBoxesConfig {
		return {
			'admin-3ConfLog@email.com': {
				small: 1,
				medium: 2,
				large: 1,
			},
		}
	},
}
