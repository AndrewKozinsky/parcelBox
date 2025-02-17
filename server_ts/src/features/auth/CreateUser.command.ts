import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CreateUserInputModel } from '../../models/auth/auth.input.model'
// import { EmailAdapterService } from '@app/email-adapter'
// import { UserRepository } from '../../repositories/user.repository'
// import { UserQueryRepository } from '../../repositories/user.queryRepository'
// import { UserOutModel } from '../../models/user/user.out.model'
// import { ErrorMessage } from '@app/shared'

export class CreateUserCommand implements ICommand {
	constructor(public readonly createUserInput: CreateUserInputModel) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
	/*constructor(
		private userRepository: UserRepository,
		private userQueryRepository: UserQueryRepository,
		private emailAdapter: EmailAdapterService,
	) {}*/

	async execute(command: CreateUserCommand) {
		// const { createUserInput } = command
		/*const existingUser = await this.userRepository.getUserByEmailOrName({
			email: createUserInput.email,
		})*/
		/*if (existingUser) {
			if (existingUser.isEmailConfirmed) {
				throw new Error(ErrorMessage.EmailOrUsernameIsAlreadyRegistered)
			}

			await this.userRepository.deleteUser(existingUser.id)
		}*/
		// const createdUser = await this.userRepository.createUser(createUserInput)
		/*await this.emailAdapter.sendEmailConfirmationMessage(
			createdUser.email,
			createdUser.emailConfirmationCode!,
		)*/
		// return (await this.userQueryRepository.getUserById(createdUser.id)) as UserOutModel
	}
}
