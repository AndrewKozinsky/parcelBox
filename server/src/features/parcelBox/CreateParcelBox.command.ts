import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CellRepository } from '../../repo/cell.repository'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { LocationRepository } from '../../repo/location.repository'
import { ParcelBoxQueryRepository } from '../../repo/parcelBox.queryRepository'
import { ParcelBoxRepository } from '../../repo/parcelBox.repository'

export class CreateParcelBoxCommand implements ICommand {
	constructor(public createParcelBoxInput: { userId: number; parcelBoxTypeId: number }) {}
}

@CommandHandler(CreateParcelBoxCommand)
export class CreateParcelBoxHandler implements ICommandHandler<CreateParcelBoxCommand> {
	constructor(
		private cellTypeRepository: CellTypeRepository,
		private parcelBoxRepository: ParcelBoxRepository,
		private parcelBoxQueryRepository: ParcelBoxQueryRepository,
		private cellRepository: CellRepository,
		private locationRepository: LocationRepository,
	) {}

	async execute(command: CreateParcelBoxCommand) {
		const { createParcelBoxInput } = command

		const createdBox = await this.parcelBoxRepository.createParcelBox(createParcelBoxInput)
		if (!createdBox) {
			throw new CustomGraphQLError(errorMessage.parcelBoxDidNotCreated, ErrorCode.InternalServerError_500)
		}

		// Find all cell types belonging to the parcelBoxType that the created parcelBox is made of
		const cellTypes = await this.cellTypeRepository.getCellTypesByParcelBoxTypeId(
			createParcelBoxInput.parcelBoxTypeId,
		)

		// Create real cell from these cell types
		const createCellsPromise = cellTypes.map((cellType, i) => {
			const cellName = (i + 1).toString()

			return this.cellRepository.createCell({
				cellTypeId: cellType.id,
				name: cellName,
				parcelBoxId: createdBox.id,
			})
		})

		const createLocation = this.locationRepository.createLocation({
			businessHoursFrom: 8,
			businessHoursTo: 18,
			address: '',
			businessDays: [1, 2, 3, 4, 5],
			parcelBoxId: createdBox.id,
		})

		await Promise.all([...createCellsPromise, createLocation])

		return await this.parcelBoxQueryRepository.getParcelBoxById(createdBox.id)
	}
}
