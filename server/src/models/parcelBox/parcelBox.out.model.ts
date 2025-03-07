import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CellOutModel } from '../cell/cell.out.model'
import { LocationOutModel } from '../location/location.out.model'

@ObjectType()
export class ParcelBoxOutModel {
	@Field(() => Int)
	id: number

	@Field(() => Int)
	parcelBoxTypeId: number

	@Field(() => Date)
	createdAt: Date

	@Field(() => [CellOutModel])
	cells: CellOutModel[]

	@Field(() => LocationOutModel)
	location: LocationOutModel
}
