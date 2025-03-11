import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LocationOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	address: null | string

	@Field(() => [Int])
	businessDays: null | number[]

	@Field(() => Int)
	businessHoursFrom: null | number

	@Field(() => Int)
	businessHoursTo: null | number
}
