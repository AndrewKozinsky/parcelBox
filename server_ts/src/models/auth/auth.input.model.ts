import { DtoFieldDecorators } from '../../db/dtoFieldDecorators'
import { bdConfig } from '../../db/dbConfig/dbConfig'
// import { IsIn, IsNumber, IsOptional } from 'class-validator'
// import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
// import { CustomException } from '../../infrastructure/exceptionFilters/customException'
// import { HTTP_STATUSES } from '../../utils/httpStatuses'
// import { ErrorMessage } from '@app/shared'
// import { plainToInstance, Type } from 'class-transformer'

export class CreateAdminInputModel {
	email: string
	password: string
}

/*export class SetNewPasswordDtoModel {
	@DtoFieldDecorators('newPassword', bdConfig.User.dtoProps.password)
	newPassword: string

	@DtoFieldDecorators('recoveryCode', bdConfig.User.dtoProps.recoveryCode)
	recoveryCode: string
}*/

/*export class ProviderNameQueryModel {
	@IsIn(['github', 'google'], { message: 'Provider must be either github or google' })
	provider: OAuthProviderName
}*/

/*export class EditMyProfileDtoModel {
	@DtoFieldDecorators('userName', bdConfig.User.dbFields.user_name)
	userName: string

	@DtoFieldDecorators('firstName', bdConfig.User.dbFields.first_name)
	firstName: null | string

	@DtoFieldDecorators('lastName', bdConfig.User.dbFields.last_name)
	lastName: null | string

	@DtoFieldDecorators('dateOfBirth', bdConfig.User.dbFields.date_of_birth)
	dateOfBirth: null | string

	@DtoFieldDecorators('countryCode', bdConfig.User.dbFields.country_code)
	countryCode: null | string

	@DtoFieldDecorators('cityId', bdConfig.User.dbFields.city_id)
	cityId: null | number

	@DtoFieldDecorators('aboutMe', bdConfig.User.dbFields.about_me)
	aboutMe: null | string
}*/

/*export class GetUserPostsQueries {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	// pageNumber is number of portions that should be returned. Default value is 1
	pageNumber?: number

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	// pageSize is portions size that should be returned. Default value is 10
	pageSize?: number
}*/

/*@Injectable()
export class GetUserPostsQueriesPipe implements PipeTransform {
	async transform(dto: GetUserPostsQueries, { metatype }: ArgumentMetadata) {
		if (!metatype) {
			return dto
		}

		return plainToInstance(metatype, dto)
	}
}*/
