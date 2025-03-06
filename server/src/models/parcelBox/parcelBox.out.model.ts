import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParcelBoxOutModel {
	@Field(() => Int)
	id: number

	@Field(() => Int)
	parcelBoxTypeId: number

	@Field(() => Date)
	createdAt: Date

	@Field(() => [ParcelBoxCellOutModel])
	cells: ParcelBoxCellOutModel[]
}

@ObjectType()
export class ParcelBoxCellOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => Int)
	cellTypeId: number

	@Field(() => Int)
	parcelBoxId: number
}
