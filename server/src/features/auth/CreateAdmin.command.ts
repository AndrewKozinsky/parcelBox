import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { UserRole } from '../../db/dbConstants'
import { EmailAdapterService } from '../../infrastructure/emailAdapter/email-adapter.service'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CreateAdminInputModel } from '../../models/auth/auth.input.model'
import { AdminQueryRepository } from '../../repo/admin.queryRepository'
import { AdminRepository } from '../../repo/admin.repository'
import { UserRepository } from '../../repo/user.repository'

export class CreateAdminCommand implements ICommand {
	constructor(public createAdminInput: CreateAdminInputModel) {}
}

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
	constructor(
		private userRepository: UserRepository,
		private adminRepository: AdminRepository,
		private adminQueryRepository: AdminQueryRepository,
		private emailAdapter: EmailAdapterService,
	) {}

	async execute(command: CreateAdminCommand) {
		const { createAdminInput } = command

		const existingUser = await this.userRepository.getUserByEmail(createAdminInput.email)

		if (existingUser) {
			const errMessage = existingUser.isEmailConfirmed
				? errorMessage.emailIsAlreadyRegistered
				: errorMessage.emailIsNotConfirmed

			throw new CustomGraphQLError(errMessage, ErrorCode.BadRequest_400)
		}

		const createdUser = await this.userRepository.createUser(createAdminInput, UserRole.Admin)
		await this.adminRepository.createAdmin(createdUser.id)

		const newAdmin = await this.adminQueryRepository.getAdminByUserId(createdUser.id)
		if (!newAdmin) {
			throw new CustomGraphQLError(errorMessage.unknownDbError, ErrorCode.InternalServerError_500)
		}

		await this.emailAdapter.sendEmailConfirmationMessage(createdUser.email, createdUser.emailConfirmationCode!)

		return newAdmin
	}
}
