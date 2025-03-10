import { User_Role } from '../../../src/graphql'

/*export enum UserRole {
	Admin = 1,
	Sender = 2,
}

export type UserConfig = {
	email: string
	password: string
	role: UserRole
	isEmailConfirmed: boolean
}

export const users = {
	unconfirmedAdmin: {
		email: 'unconfirmedAdmin@mail.com',
		password: '123456',
		role: UserRole.Admin,
		isEmailConfirmed: false,
	},
	confirmedAdmin: {
		email: 'confirmedAdmin@mail.com',
		password: '123456',
		role: UserRole.Admin,
		isEmailConfirmed: true,
	},
	admin: { email: 'admin@mail.com', password: '123456', role: UserRole.Admin, isEmailConfirmed: true },
	unconfirmedSender: {
		email: 'unconfirmedSender@mail.com',
		password: '123456',
		role: UserRole.Sender,
		isEmailConfirmed: false,
	},
	confirmedSender: {
		email: 'confirmedSender@mail.com',
		password: '123456',
		role: UserRole.Sender,
		isEmailConfirmed: true,
	},
	sender: { email: 'sender@mail.com', password: '123456', role: UserRole.Sender, isEmailConfirmed: true },
	sender2: { email: 'sender2@mail.com', password: '123456', role: UserRole.Sender, isEmailConfirmed: true },
} satisfies Record<string, UserConfig>*/

// --

export type UserConfig = {
	// Initially user id is null.
	// When he was created number was set here.
	id: null | number
	email: string
	role: User_Role
	password: string
	confirmed: boolean
	login: boolean
}

export type UsersConfig = Record<string, UserConfig>

export const usersConfig = {
	admin_1: {
		id: null,
		email: 'admin-1@email.com',
		role: User_Role.Admin,
		password: 'adminPassword-1',
		confirmed: false,
		login: false,
	},
	admin_2_conf: {
		id: null,
		email: 'admin-2Conf@email.com',
		role: User_Role.Admin,
		password: 'adminPassword-2',
		confirmed: true,
		login: false,
	},
	admin_3_confLog: {
		id: null,
		email: 'admin-3ConfLog@email.com',
		role: User_Role.Admin,
		password: 'adminPassword-3',
		confirmed: true,
		login: true,
	},
	admin_4_conf: {
		id: null,
		email: 'admin-4Conf@email.com',
		role: User_Role.Admin,
		password: 'adminPassword-3',
		confirmed: true,
		login: false,
	},
	sender_1: {
		id: null,
		email: 'sender-1@email.com',
		role: User_Role.Sender,
		password: 'senderPassword-1',
		confirmed: false,
		login: false,
	},
	sender_2: {
		id: null,
		email: 'sender-2@email.com',
		role: User_Role.Sender,
		password: 'senderPassword-2',
		confirmed: false,
		login: false,
	},
	sender_3_conf: {
		id: null,
		email: 'sender-3-Conf@email.com',
		role: User_Role.Sender,
		password: 'senderPassword-3',
		confirmed: true,
		login: false,
	},
	sender_4_confLog: {
		id: null,
		email: 'sender-4-ConfLog@email.com',
		role: User_Role.Sender,
		password: 'senderPassword-4',
		confirmed: true,
		login: true,
	},
	sender_5_confLog: {
		id: null,
		email: 'sender-5-ConfLog@email.com',
		role: User_Role.Sender,
		password: 'senderPassword-5',
		confirmed: true,
		login: true,
	},
} satisfies UsersConfig
