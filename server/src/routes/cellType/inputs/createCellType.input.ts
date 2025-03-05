import { Field, InputType } from '@nestjs/graphql'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

@InputType()
export class CreateCellTypeInput {
	@Field({ description: 'Cell type name' })
	@DtoFieldDecorators('email', bdConfig.CellType.dbFields.name)
	name: string

	@Field({ description: 'Cell width' })
	@DtoFieldDecorators('email', bdConfig.CellType.dbFields.width)
	width: number

	@Field({ description: 'Cell height' })
	@DtoFieldDecorators('email', bdConfig.CellType.dbFields.height)
	height: number

	@Field({ description: 'Cell depth' })
	@DtoFieldDecorators('email', bdConfig.CellType.dbFields.depth)
	depth: number

	@Field({ description: 'Cell depth' })
	@DtoFieldDecorators('email', bdConfig.CellType.dtoProps.parcelBoxTypeId)
	parcelBoxTypeId: number
}
