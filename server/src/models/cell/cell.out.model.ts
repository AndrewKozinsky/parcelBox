import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CellOutModel {
	@Field(() => Int)
	id: number
}
