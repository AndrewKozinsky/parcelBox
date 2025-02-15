import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MainConfigService {
	constructor(private configService: ConfigService) {}

	get() {
		const enVariables = this.getEnVariables()

		return {
			mode: enVariables.mode,
			port: enVariables.port,
		}
	}

	private getEnVariables() {
		type IEnVars = {
			mode: 'development' | 'production'
			port: number
		}

		const enVariables = {
			mode: this.configService.get<string>('MODE') as any,
			port: this.configService.get<string>('PORT') as any,
		} as IEnVars

		for (const key in enVariables) {
			if (!enVariables[key]) {
				throw new Error(`Unable to find environment: ${key}`)
			}
		}

		return enVariables
	}
}
