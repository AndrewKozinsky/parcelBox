import { Injectable } from '@nestjs/common'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'

// Check if the database has passed parcel box type id
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
