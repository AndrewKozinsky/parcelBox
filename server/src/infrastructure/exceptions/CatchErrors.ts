import { CustomGraphQLError } from './customGraphQLError'
import { ErrorCode } from './errorCode'
import { errorMessage } from './errorMessage'

/**
 * Decorator for class method:
 * class ExampleService {
 *   @CatchDbError()
 *   async fetchData() {
 *     // Simulate an error
 *     throw new Error("Something went wrong!");
 *   }
 * }
 * It wraps decorated method into block try...catch and throws custom GraphQL error if some error happened
 * @constructor
 */
function CatchDbError() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value

		descriptor.value = async function (...args: any[]) {
			try {
				return await originalMethod.apply(this, args)
			} catch (error) {
				if ('message' in error) {
					throw new CustomGraphQLError(error.message, ErrorCode.InternalServerError_500)
				}

				throw new CustomGraphQLError(errorMessage.unknownDbError, ErrorCode.InternalServerError_500)
			}
		}

		return descriptor
	}
}

export default CatchDbError
