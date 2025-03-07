import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CellOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => Int)
	cellTypeId: number

	@Field(() => Int)
	parcelBoxId: number

	@Field(() => Int)
	width: number

	@Field(() => Int)
	height: number

	@Field(() => Int)
	depth: number
}
