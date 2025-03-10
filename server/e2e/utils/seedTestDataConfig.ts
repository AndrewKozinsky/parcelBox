import { UserRole } from '../../src/db/dbConstants'

type UserConfig = {
	// Initially user id is null.
	// When he was created number was set here.
	id: null | number
	email: string
	role: UserRole
	password: string
	confirmed: boolean
	login: boolean
}

export type UsersConfig = Record<string, UserConfig>

const usersConfig = {
	admin_1: {
		id: null,
		email: 'admin-1@email.com',
		role: UserRole.Admin,
		password: 'adminPassword-1',
		confirmed: false,
		login: false,
	},
	admin_2_conf: {
		id: null,
		email: 'admin-2Conf@email.com',
		role: UserRole.Admin,
		password: 'adminPassword-2',
		confirmed: true,
		login: false,
	},
	admin_3_confLog: {
		id: null,
		email: 'admin-3ConfLog@email.com',
		role: UserRole.Admin,
		password: 'adminPassword-3',
		confirmed: true,
		login: true,
	},
	admin_4_conf: {
		id: null,
		email: 'admin-4Conf@email.com',
		role: UserRole.Admin,
		password: 'adminPassword-3',
		confirmed: true,
		login: false,
	},
	sender_1: {
		id: null,
		email: 'sender-1@email.com',
		role: UserRole.Sender,
		password: 'senderPassword-1',
		confirmed: false,
		login: false,
	},
	sender_2: {
		id: null,
		email: 'sender-2@email.com',
		role: UserRole.Sender,
		password: 'senderPassword-2',
		confirmed: false,
		login: false,
	},
	sender_3_conf: {
		id: null,
		email: 'sender-3-Conf@email.com',
		role: UserRole.Sender,
		password: 'senderPassword-3',
		confirmed: true,
		login: false,
	},
	sender_4_confLog: {
		id: null,
		email: 'sender-4-ConfLog@email.com',
		role: UserRole.Sender,
		password: 'senderPassword-4',
		confirmed: true,
		login: true,
	},
	sender_5_confLog: {
		id: null,
		email: 'sender-5-ConfLog@email.com',
		role: UserRole.Sender,
		password: 'senderPassword-5',
		confirmed: true,
		login: true,
	},
} satisfies UsersConfig

type UserParcelBoxConfig = Record<string, number>

type ParcelBoxesConfig = Record<string, UserParcelBoxConfig>

export const seedTestDataConfig = {
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
			'admin-4Conf@email.com': {
				small: 1,
				large: 2,
			},
		}
	},
}
