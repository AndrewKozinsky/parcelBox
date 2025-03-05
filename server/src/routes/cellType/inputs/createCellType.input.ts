import { Injectable } from '@nestjs/common'
import { Field, InputType, Int } from '@nestjs/graphql'
import { Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'
import { CustomGraphQLError } from '../../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../../infrastructure/exceptions/errorMessage'
import { ParcelBoxTypeQueryRepository } from '../../../repo/parcelBoxType.queryRepository'

@ValidatorConstraint({ name: 'parcelBoxTypeId', async: true })
@Injectable()
export class CodeCustomValidation implements ValidatorConstraintInterface {
	constructor(private readonly parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository) {}

	async validate(parcelBoxTypeId: number): Promise<boolean> {
		const parcelBox = await this.parcelBoxTypeQueryRepository.getParcelBoxTypeById(parcelBoxTypeId)

		if (!parcelBox) {
			throw new CustomGraphQLError(errorMessage.parcelBoxTypeDoesNotExist, ErrorCode.BadRequest_400)
		}

		return true
	}
}

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
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.CellType.dtoProps.parcelBoxTypeId)
	// @Validate(CodeCustomValidation)
	@Field(() => Int)
	parcelBoxTypeId: number
}
