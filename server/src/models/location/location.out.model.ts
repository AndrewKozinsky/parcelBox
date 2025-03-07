import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LocationOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	address: string

	@Field(() => [Int])
	businessDays: number[]

	@Field(() => Int)
	businessHoursFrom: number

	@Field(() => Int)
	businessHoursTo: number
}
