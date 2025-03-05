import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../repo/parcelBoxType.repository'
import { CreateParcelBoxTypeInput } from '../../routes/parcelBoxType/inputs/createParcelBoxType.input'

export class CreateParcelBoxTypeCommand implements ICommand {
	constructor(public createParcelBoxTypeInput: CreateParcelBoxTypeInput) {}
}

@CommandHandler(CreateParcelBoxTypeCommand)
export class CreateParcelBoxTypeHandler implements ICommandHandler<CreateParcelBoxTypeCommand> {
	constructor(
		private parcelBoxTypeRepository: ParcelBoxTypeRepository,
		private parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository,
	) {}

	async execute(command: CreateParcelBoxTypeCommand) {
		const { createParcelBoxTypeInput } = command

		const createdBox = await this.parcelBoxTypeRepository.createParcelBoxType(createParcelBoxTypeInput)
		if (!createdBox) {
			throw new CustomGraphQLError(errorMessage.parcelBoxTypeDidNotCreated, ErrorCode.InternalServerError_500)
		}

		return await this.parcelBoxTypeQueryRepository.getParcelBoxTypeById(createdBox.id)
	}
}
