import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CellTypeOutModel } from '../cellType/cellType.out.model'

@ObjectType()
export class ParcelBoxTypeOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string

	@Field(() => [CellTypeOutModel])
	cellTypes: CellTypeOutModel[]
}
