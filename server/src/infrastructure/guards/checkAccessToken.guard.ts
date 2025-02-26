import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { CustomGraphQLError } from '../exceptions/customGraphQLError'
import { ErrorCode } from '../exceptions/errorCode'
import { errorMessage } from '../exceptions/errorMessage'

@Injectable()
export class CheckAccessTokenGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		const isRequestAllowed = !!request.user

		if (!isRequestAllowed) {
			throw new CustomGraphQLError(errorMessage.accessTokenIsNotValid, ErrorCode.Unauthorized_401)
		}

		return true
	}
}
