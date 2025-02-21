import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { CustomGraphQLError } from '../exceptions/customGraphQLError'
import { ErrorCode } from '../exceptions/errorCode'
import { errorMessage } from '../exceptions/errorMessage'

@Injectable()
export class CheckAccessTokenGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()

		console.log({ request })
		const isRequestAllowed = !!request.user

		if (!isRequestAllowed) {
			throw new CustomGraphQLError(errorMessage.accessTokenIsNotValid, ErrorCode.Unauthorized_401)
		}

		return true
	}
}
