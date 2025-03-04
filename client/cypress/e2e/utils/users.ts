export enum UserRole {
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
} satisfies Record<string, UserConfig>
