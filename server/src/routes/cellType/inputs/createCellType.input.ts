import { Field, InputType, Int } from '@nestjs/graphql'
import { Validate } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'
import { ParcelBoxTypeIdValidation } from '../../common/inputs'

@InputType()
export class CreateCellTypeInput {
	@Field({ description: 'Cell type name' })
	@DtoFieldDecorators('email', bdConfig.CellType.dbFields.name)
	name: string

	@Field({ description: 'Cell width' })
	@DtoFieldDecorators('width', bdConfig.CellType.dbFields.width)
	@Field(() => Int)
	width: number

	@Field({ description: 'Cell height' })
	@DtoFieldDecorators('height', bdConfig.CellType.dbFields.height)
	@Field(() => Int)
	height: number

	@Field({ description: 'Cell depth' })
	@DtoFieldDecorators('depth', bdConfig.CellType.dbFields.depth)
	@Field(() => Int)
	depth: number

	@Field({ description: 'Cell depth' })
	@Field(() => Int)
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.CellType.dtoProps.parcelBoxTypeId)
	@Validate(ParcelBoxTypeIdValidation)
	parcelBoxTypeId: number
}
