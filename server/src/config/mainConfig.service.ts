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
				domainRootWithProtocol: enVariables.siteDomainRootWithProtocol,
			},
			emailAdapter: {
				userId: enVariables.emailAdapterUserId,
				secret: enVariables.emailAdapterSecret,
				fromName: enVariables.emailAdapterFromName,
				fromEmail: enVariables.emailAdapterFromEmail,
			},
			accessToken: {
				name: 'accessToken',
				lifeDurationInMs: 1000 * 60 * 30, // 30 minutes
			},
			refreshToken: {
				name: 'refreshToken',
				// lifetimeInMs ???
				lifeDurationInMs: 1000 * 60 * 60 * 24 * 30, // 30 days
			},
			jwt: {
				secret: 'CpTxoVgztCSd',
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
			siteDomainRootWithProtocol: this.configService.get<string>('SITE_DOMAIN_ROOT_WITH_PROTOCOL') as string,
			emailAdapterUserId: this.configService.get<string>('EMAIL_ADAPTER_USER_ID') as string,
			emailAdapterSecret: this.configService.get<string>('EMAIL_ADAPTER_SECRET') as string,
			emailAdapterFromName: this.configService.get<string>('EMAIL_ADAPTER_FROM_NAME') as string,
			emailAdapterFromEmail: this.configService.get<string>('EMAIL_ADAPTER_FROM_EMAIL') as string,
		}

		for (const key in enVariables) {
			if (!enVariables[key]) {
				throw new Error(`Unable to find environment: ${key}`)
			}
		}

		return enVariables
	}
}
