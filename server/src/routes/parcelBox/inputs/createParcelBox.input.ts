import { Field, InputType, Int } from '@nestjs/graphql'
import { Validate } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'
import { ParcelBoxTypeIdValidation } from '../../common/inputs'

@InputType()
export class CreateParcelBoxInput {
	@Field(() => Int, { description: 'Parcel box type id' })
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.ParcelBox.dbFields.parcel_box_type_id)
	@Validate(ParcelBoxTypeIdValidation)
	parcelBoxTypeId: number

	@Field(() => String, { description: 'Parcel box address', nullable: true })
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.Location.dbFields.address)
	address?: string

	@Field(() => [Int], { description: 'Business days of the place where parcel box is located', nullable: true })
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.Location.dbFields.business_days)
	businessDays?: number[]

	@Field(() => Int, { description: 'Working hours from', nullable: true })
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.Location.dbFields.business_hours_from)
	businessHoursFrom?: number

	@Field(() => Int, { description: 'Working hours to', nullable: true })
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.Location.dbFields.business_hours_to)
	businessHoursTo?: number
}
