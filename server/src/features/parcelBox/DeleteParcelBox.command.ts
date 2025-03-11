import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { ParcelBoxRepository } from '../../repo/parcelBox.repository'
import { DeleteParcelBoxInput } from '../../routes/parcelBox/inputs/deleteParcelBox.input'

export class DeleteParcelBoxCommand implements ICommand {
	constructor(public deleteParcelBoxInput: DeleteParcelBoxInput) {}
}

@CommandHandler(DeleteParcelBoxCommand)
export class DeleteParcelBoxHandler implements ICommandHandler<DeleteParcelBoxCommand> {
	constructor(private parcelBoxRepository: ParcelBoxRepository) {}

	async execute(command: DeleteParcelBoxCommand) {
		const { deleteParcelBoxInput } = command

		const isBoxDeleted = await this.parcelBoxRepository.deleteParcelBox(deleteParcelBoxInput.parcelBoxId)
		if (!isBoxDeleted) {
			throw new CustomGraphQLError(errorMessage.parcelBoxDidNotCreated, ErrorCode.InternalServerError_500)
		}

		return true
	}
}
