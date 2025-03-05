import { Field, InputType } from '@nestjs/graphql'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

@InputType()
export class CreateParcelBoxTypeInput {
	@Field({ description: 'Parcel box type name' })
	@DtoFieldDecorators('email', bdConfig.ParcelBoxType.dbFields.name)
	name: string
}
