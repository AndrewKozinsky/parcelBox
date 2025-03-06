import { Injectable } from '@nestjs/common'
import { Field, InputType, Int } from '@nestjs/graphql'
import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'
import { errorMessage } from '../../../infrastructure/exceptions/errorMessage'
import { ParcelBoxTypeQueryRepository } from '../../../repo/parcelBoxType.queryRepository'

@ValidatorConstraint({ async: true })
@Injectable()
export class ParcelBoxTypeIdValidation implements ValidatorConstraintInterface {
	constructor(private parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository) {}

	async validate(parcelBoxTypeId: number): Promise<boolean> {
		const parcelBox = await this.parcelBoxTypeQueryRepository.getParcelBoxTypeById(parcelBoxTypeId)

		return !!parcelBox
	}

	defaultMessage(args: ValidationArguments) {
		return errorMessage.parcelBoxTypeDoesNotExist
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
	@Field(() => Int)
	@DtoFieldDecorators('parcelBoxTypeId', bdConfig.CellType.dtoProps.parcelBoxTypeId)
	@Validate(ParcelBoxTypeIdValidation)
	parcelBoxTypeId: number
}
