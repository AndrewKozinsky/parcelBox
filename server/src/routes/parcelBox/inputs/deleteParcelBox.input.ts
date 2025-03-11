import { Field, InputType, Int } from '@nestjs/graphql'
import { Validate } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'
import { ParcelBoxIdValidation, ParcelBoxTypeIdValidation, UserIdValidation } from '../../common/inputs'

@InputType()
export class DeleteParcelBoxInput {
	@Field(() => Int, { description: 'Parcel box id' })
	@DtoFieldDecorators('parcelBoxId', bdConfig.ParcelBox.dbFields.id)
	@Validate(ParcelBoxIdValidation)
	parcelBoxId: number
}
