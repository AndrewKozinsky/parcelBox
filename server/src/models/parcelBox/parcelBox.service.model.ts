import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CellOutModel } from '../cell/cell.out.model'
import { LocationOutModel } from '../location/location.out.model'

@ObjectType()
export class ParcelBoxServiceModel {
	@Field(() => Int)
	id: number

	@Field(() => Int)
	parcelBoxTypeId: number

	@Field(() => String)
	parcelBoxTypeName: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => [CellOutModel])
	cells: CellOutModel[]

	@Field(() => LocationOutModel)
	location: LocationOutModel
}
