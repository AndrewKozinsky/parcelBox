import { Field, InputType } from '@nestjs/graphql'
import { Validate } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'
import { ParcelBoxTypeIdValidation, UserIdValidation } from '../../common/inputs'

@InputType()
export class CreateParcelBoxInput {
	@Field({ description: 'Parcel box type id' })
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.ParcelBox.dbFields.parcel_box_type_id)
	@Validate(ParcelBoxTypeIdValidation)
	parcelBoxTypeId: number

	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.ParcelBox.dbFields.user_id)
	@Field({ description: 'User id who belongs to this parcel box' })
	@Validate(UserIdValidation)
	userId: number
}
