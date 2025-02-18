import { bdConfig } from '../../db/dbConfig/dbConfig'
// import { IsIn, IsNumber, IsOptional } from 'class-validator'
// import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
// import { plainToInstance, Type } from 'class-transformer'

export class CreateAdminInputModel {
	email: string
	password: string
}

export class CreateSenderInputModel {
	email: string
	password: string
}

/*export class SetNewPasswordDtoModel {
	newPassword: string
	recoveryCode: string
}*/

/*export class ProviderNameQueryModel {
	@IsIn(['github', 'google'], { message: 'Provider must be either github or google' })
	provider: OAuthProviderName
}*/

/*export class EditMyProfileDtoModel {
	userName: string
	firstName: null | string
	lastName: null | string
	dateOfBirth: null | string
	countryCode: null | string
	cityId: null | number
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
