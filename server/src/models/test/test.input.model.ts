import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class GetUserQueries {
	@IsEmail()
	@IsNotEmpty()
	email: string
}

@Injectable()
export class GetUserQueriesPipe implements PipeTransform {
	async transform(dto: GetUserQueries, { metatype }: ArgumentMetadata) {
		if (!metatype) {
			return dto
		}

		return plainToInstance(metatype, dto)
	}
}
