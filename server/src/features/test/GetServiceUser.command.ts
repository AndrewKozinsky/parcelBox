import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import axios from 'axios'
import { UserRole } from '../../db/dbConstants'
import RouteNames from '../../infrastructure/routeNames'
import { UserRepository } from '../../repo/user.repository'
import { queries } from './queries'

export class GetServiceUserCommand {
	constructor(public userEmail: string) {}
}

@CommandHandler(GetServiceUserCommand)
export class GetServiceUserHandler implements ICommandHandler<GetServiceUserCommand> {
	constructor(private userRepository: UserRepository) {}

	async execute(command: GetServiceUserCommand) {
		const { userEmail } = command

		return await this.userRepository.getUserByEmail(userEmail)
	}
}
