import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import axios from 'axios'
import { UserRole } from '../../db/dbConstants'
import RouteNames from '../../infrastructure/routeNames'
import { UserRepository } from '../../repo/user.repository'
import { queries } from './queries'

export class SeedTestDataCommand {
	constructor() {}
}

@CommandHandler(SeedTestDataCommand)
export class SeedTestDataHandler implements ICommandHandler<SeedTestDataCommand> {
	constructor(private userRepository: UserRepository) {}

	async execute() {
		const usersConfig: { email: string; password: string; role: UserRole; isEmailConfirmed: boolean }[] = [
			{ email: 'unconfirmedAdmin@mail.com', password: '123456', role: UserRole.Admin, isEmailConfirmed: false },
			{ email: 'confirmedAdmin@mail.com', password: '123456', role: UserRole.Admin, isEmailConfirmed: true },
			{ email: 'admin@mail.com', password: '123456', role: UserRole.Admin, isEmailConfirmed: true },
			{ email: 'unconfirmedSender@mail.com', password: '123456', role: UserRole.Sender, isEmailConfirmed: false },
			{ email: 'confirmedSender@mail.com', password: '123456', role: UserRole.Sender, isEmailConfirmed: true },
			{ email: 'sender@mail.com', password: '123456', role: UserRole.Sender, isEmailConfirmed: true },
			{ email: 'sender2@mail.com', password: '123456', role: UserRole.Sender, isEmailConfirmed: true },
		]

		const requests = usersConfig.map((userConf) => {
			return userConf.isEmailConfirmed
				? this.createUserWithConfirmedEmail(userConf)
				: this.createUserWithUnconfirmedEmail(userConf)
		})

		await Promise.all(requests)
	}

	async createUserWithConfirmedEmail(props: { role: UserRole; email: string; password: string }) {
		const createdUser = await this.createUserWithUnconfirmedEmail(props)
		if (!createdUser) return

		const { emailConfirmationCode } = createdUser

		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)
		await this.makeGraphQLReq(confirmEmailQuery)

		return await this.userRepository.getUserById(createdUser.id)
	}

	async createUserWithUnconfirmedEmail(props: { role: UserRole; email: string; password: string }) {
		const mutationArgs = {
			email: props.email,
			password: props.password,
		}

		const createUserMutation =
			props.role === UserRole.Admin
				? queries.auth.registerAdmin(mutationArgs)
				: queries.auth.registerSender(mutationArgs)

		const createUserResp = await this.makeGraphQLReq(createUserMutation)

		const routeName =
			props.role === UserRole.Admin ? RouteNames.AUTH.REGISTER_ADMIN : RouteNames.AUTH.REGISTER_SENDER

		const userId = createUserResp.data[routeName].id
		return await this.userRepository.getUserById(userId)
	}

	async makeGraphQLReq(query: string) {
		const response = await axios.post('http://localhost:3000/graphql', { query })

		return response.data
	}
}
