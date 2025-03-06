import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { ParcelBoxTypeRepository } from '../../repo/parcelBoxType.repository'

export class SeedInitDataCommand implements ICommand {
	constructor() {}
}

@CommandHandler(SeedInitDataCommand)
export class SeedInitDataHandler implements ICommandHandler<SeedInitDataCommand> {
	constructor(
		private parcelBoxTypeRepository: ParcelBoxTypeRepository,
		private cellTypeRepository: CellTypeRepository,
	) {}

	async execute(command: SeedInitDataCommand) {
		await this.seedDataIfNecessary()
	}

	/** Creates 3 parcel box types with cell types if any box types don't exist in database */
	async seedDataIfNecessary() {
		if (await this.isBoxTypesExistsInDB()) return
		await this.createBoxTypes()
	}

	/** Check if parcel box types already exist in database */
	async isBoxTypesExistsInDB() {
		const boxes = await this.parcelBoxTypeRepository.getAllParcelBoxTypes()
		return boxes.length > 0
	}

	/** Creates 3 parcel box types with cell types in database */
	async createBoxTypes() {
		for (let boxTypeConfig of this.getConfig()) {
			const createdBoxType = await this.parcelBoxTypeRepository.createParcelBoxType(boxTypeConfig)
			if (!createdBoxType) {
				throw new CustomGraphQLError(errorMessage.unknownDbError, ErrorCode.InternalServerError_500)
			}

			for (let cellTypeConf of boxTypeConfig.cells) {
				const createdCellType = await this.cellTypeRepository.createCellType({
					...cellTypeConf,
					parcelBoxTypeId: createdBoxType.id,
				})
				if (!createdCellType) {
					throw new CustomGraphQLError(errorMessage.unknownDbError, ErrorCode.InternalServerError_500)
				}
			}
		}
	}

	/** Return config for creating parcel box types with cell types */
	getConfig() {
		type ParcelBoxTypeConfig = { name: string; cells: CellTypeConfig[] }
		type CellTypeConfig = {
			name: string
			width: number
			height: number
			depth: number
		}

		const boxTypesConfig: ParcelBoxTypeConfig[] = [
			{
				name: 'small',
				cells: [
					{
						name: '1 cell',
						width: 10,
						height: 12,
						depth: 40,
					},
					{
						name: '2 cell',
						width: 10,
						height: 12,
						depth: 40,
					},
					{
						name: '3 cell',
						width: 20,
						height: 24,
						depth: 40,
					},
				],
			},
			{
				name: 'medium',
				cells: [
					{
						name: '1 cell',
						width: 20,
						height: 24,
						depth: 40,
					},
					{
						name: '2 cell',
						width: 20,
						height: 24,
						depth: 40,
					},
					{
						name: '3 cell',
						width: 20,
						height: 24,
						depth: 40,
					},
					{
						name: '4 cell',
						width: 20,
						height: 24,
						depth: 40,
					},
				],
			},
			{
				name: 'large',
				cells: [
					{
						name: '1 cell',
						width: 30,
						height: 40,
						depth: 60,
					},
					{
						name: '1 cell',
						width: 30,
						height: 40,
						depth: 60,
					},
					{
						name: '1 cell',
						width: 30,
						height: 40,
						depth: 60,
					},
					{
						name: '1 cell',
						width: 30,
						height: 40,
						depth: 60,
					},
					{
						name: '1 cell',
						width: 60,
						height: 80,
						depth: 60,
					},
				],
			},
		]

		return boxTypesConfig
	}
}
