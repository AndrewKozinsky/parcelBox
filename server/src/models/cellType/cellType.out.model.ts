import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CellTypeOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => Int)
	width: number

	@Field(() => Int)
	height: number

	@Field(() => Int)
	depth: number

	@Field(() => Int)
	parcelBoxTypeId: number
}
