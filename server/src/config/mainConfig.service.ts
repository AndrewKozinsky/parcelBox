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
			db: {
				name: enVariables.dnName,
				user: enVariables.dnUserName,
				password: enVariables.dnUserPassword,
			},
			site: {
				name: enVariables.siteName,
				domainRoot: enVariables.siteDomainRoot,
			},
		}
	}

	private getEnVariables() {
		const enVariables = {
			mode: this.configService.get<string>('MODE') as 'development' | 'production',
			port: parseInt(this.configService.get<string>('PORT') as string),
			dnName: this.configService.get<string>('DB_NAME') as string,
			dnUserName: this.configService.get<string>('DB_USER_NAME') as string,
			dnUserPassword: this.configService.get<string>('DB_USER_PASSWORD') as string,
			siteName: this.configService.get<string>('SITE_NAME') as string,
			siteDomainRoot: this.configService.get<string>('SITE_DOMAIN_ROOT') as string,
		}

		for (const key in enVariables) {
			if (!enVariables[key]) {
				throw new Error(`Unable to find environment: ${key}`)
			}
		}

		return enVariables
	}
}
