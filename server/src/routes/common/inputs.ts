import { Injectable } from '@nestjs/common'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'
import { UserQueryRepository } from '../../repo/user.queryRepository'

// Check if the database has passed parcel box type id
@ValidatorConstraint({ async: true })
@Injectable()
export class UserIdValidation implements ValidatorConstraintInterface {
	constructor(private userQueryRepository: UserQueryRepository) {}

	async validate(userId: number): Promise<boolean> {
		const user = await this.userQueryRepository.getUserById(userId)

		return !!user
	}

	defaultMessage(args: ValidationArguments) {
		return errorMessage.userNotFound
	}
}

// Check if the user with passed id exists in the database
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
