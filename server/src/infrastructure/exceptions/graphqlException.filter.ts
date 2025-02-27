import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common'
import { isArray } from 'class-validator'
import { GraphQLError } from 'graphql'
import { errorMessage } from './errorMessage'

@Catch()
export class GraphQLValidationFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		if (exception instanceof GraphQLError) {
			return new GraphQLError(exception.message, {
				extensions: {
					code: exception.extensions.code,
				},
			})
		}

		if (exception instanceof BadRequestException) {
			const response = exception.getResponse()

			if (typeof response === 'object' && 'message' in response) {
				if (isArray(response.message)) {
					return new GraphQLError(errorMessage.wrongInputData, {
						extensions: {
							code: 400,
							fields: this.convertErrorsArrToErrorsObj(response.message as any),
						},
					})
				}
			}
		}

		return new GraphQLError('My unknown err')
	}

	convertErrorsArrToErrorsObj(originalMessages: { message: string; field: string }[]): Record<string, string[]> {
		const result: Record<string, string[]> = {}

		originalMessages.forEach((messageObj) => {
			if (!result[messageObj.field]) {
				result[messageObj.field] = []
			}

			result[messageObj.field].push(messageObj.message)
		})

		return result
	}
}
