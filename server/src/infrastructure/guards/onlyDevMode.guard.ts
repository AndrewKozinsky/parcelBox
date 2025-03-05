import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { MainConfigService } from '../config/mainConfig.service'
import { CustomRestError } from '../exceptions/customErrors'
import { ErrorCode } from '../exceptions/errorCode'
import { errorMessage } from '../exceptions/errorMessage'

@Injectable()
export class OnlyDevOrTestingModeGuard implements CanActivate {
	constructor(private mainConfig: MainConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		if (['testing', 'development'].includes(this.mainConfig.get().mode)) {
			return true
		}

		throw new CustomRestError(errorMessage.onlyDevMode, ErrorCode.BadRequest_400)
	}
}
