import { applyDecorators } from '@nestjs/common'
import {
	IsArray,
	IsDateString,
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator'
import { errorMessage } from '../infrastructure/exceptions/errorMessage'
import { Trim } from '../infrastructure/pipes/Trim.decorator'
import { BdConfig } from './dbConfig/dbConfigType'
import { Type } from 'class-transformer'

// @IsIn(['desc', 'asc'])
// @IsEnum(LikeStatuses)
// @ArrayMinSize(1)

/**
 * Creates universal decorator to check property in DTO for compliance with fieldConf
 * @param fieldName — name of the field. For example: email, recoveryCode, cityId
 * @param dbFieldConf — database field config object
 * @param rewrittenDbConfigFields — changes for database field config object
 */
export function DtoFieldDecorators(
	fieldName: string,
	dbFieldConf: BdConfig.Field,
	rewrittenDbConfigFields: Partial<BdConfig.Field> = {},
) {
	const updatedFieldConf = Object.assign(dbFieldConf, rewrittenDbConfigFields)

	// Set the first letter to lowercase 'password' -> 'Password'
	const name = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)

	const decorators: any[] = []

	if (updatedFieldConf.type === 'string') {
		decorators.push(IsString({ message: name + ' must be a string' }))
		decorators.push(Trim())

		if (updatedFieldConf.minLength) {
			decorators.push(
				MinLength(updatedFieldConf.minLength, {
					message: errorMessage.minCharacters(updatedFieldConf.minLength),
				}),
			)
		}

		if (updatedFieldConf.maxLength) {
			decorators.push(
				MaxLength(updatedFieldConf.maxLength, {
					message: errorMessage.maxCharacters(updatedFieldConf.maxLength),
				}),
			)
		}

		if (updatedFieldConf.match) {
			const errMessage = updatedFieldConf.matchErrorMessage
				? updatedFieldConf.matchErrorMessage
				: name + ' does not match'

			decorators.push(Matches(updatedFieldConf.match, { message: errMessage }))
		}

		if (!updatedFieldConf.required) {
			decorators.push(IsOptional())
		}
	}
	if (updatedFieldConf.type === 'dateString') {
		decorators.push(
			IsDateString(
				{},
				{
					message:
						name +
						' must be a date string in ISO format. Example: 2024-09-29T09:18:40.523Z. Use new Date().toISOString() to do it',
				},
			),
		)

		if (!updatedFieldConf.required) {
			decorators.push(IsOptional())
		}
	}
	if (updatedFieldConf.type === 'email') {
		decorators.push(IsString({ message: name + ' must be a string' }))
		decorators.push(IsEmail({}, { message: 'The email must match the format example@mail.com' }))
		if (!updatedFieldConf.required) {
			decorators.push(IsOptional())
		}
	}
	if (updatedFieldConf.type === 'number') {
		// @Type(() => Number)
		decorators.push(IsNumber)

		if (updatedFieldConf.min) {
			decorators.push(Min(updatedFieldConf.min, { message: errorMessage.minNum(updatedFieldConf.min) }))
		}
		if (updatedFieldConf.max) {
			decorators.push(Max(updatedFieldConf.max, { message: errorMessage.maxNum(updatedFieldConf.max) }))
		}
		if (!updatedFieldConf.required) {
			decorators.push(IsOptional())
		}
	}
	if (updatedFieldConf.type === 'boolean') {
		decorators.push(Type(() => Boolean))
		if (!updatedFieldConf.required) {
			decorators.push(IsOptional())
		}
	}
	if (updatedFieldConf.type === 'array') {
		let errorMessage = name + ' must be an array.'

		if (updatedFieldConf.arrayItemType === 'string') {
			errorMessage = name + ' must be an array of strings.'
		}

		if (updatedFieldConf.arrayItemType === 'mongoId') {
			errorMessage = name + ' must be an array of mongoId strings.'
		}

		decorators.push(IsArray({ message: errorMessage }))

		if (updatedFieldConf.arrayItemType === 'string') {
			decorators.push(IsString({ each: true }))
		}

		if (!updatedFieldConf.required) {
			decorators.push(IsOptional())
		}
	}

	return applyDecorators(...decorators)
}
