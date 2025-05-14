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
				name: enVariables.dbName,
				user: enVariables.dbUserName,
				password: enVariables.dbUserPassword,
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
			daData: {
				key: enVariables.daDataKey,
				secretKey: enVariables.daDataSecretKey,
			},
		}
	}

	private getEnVariables() {
		const enVariables = {
			mode: this.configService.get<string>('MODE') as 'testing' | 'development' | 'server',
			port: parseInt(this.configService.get<string>('PORT') as string),
			dbName: this.configService.get<string>('POSTGRES_DB') as string,
			dbUserName: this.configService.get<string>('POSTGRES_USER') as string,
			dbUserPassword: this.configService.get<string>('POSTGRES_PASSWORD') as string,
			siteName: this.configService.get<string>('SITE_NAME') as string,
			siteDomainRoot: this.configService.get<string>('SITE_DOMAIN_ROOT') as string,
			siteDomainRootWithProtocol: this.configService.get<string>('SITE_DOMAIN_ROOT_WITH_PROTOCOL') as string,
			emailAdapterUserId: this.configService.get<string>('EMAIL_ADAPTER_USER_ID') as string,
			emailAdapterSecret: this.configService.get<string>('EMAIL_ADAPTER_SECRET') as string,
			emailAdapterFromName: this.configService.get<string>('EMAIL_ADAPTER_FROM_NAME') as string,
			emailAdapterFromEmail: this.configService.get<string>('EMAIL_ADAPTER_FROM_EMAIL') as string,
			daDataKey: this.configService.get<string>('DADATA_KEY') as string,
			daDataSecretKey: this.configService.get<string>('DADATA_SECRET_KEY') as string,
		}

		for (const key in enVariables) {
			if (!enVariables[key]) {
				throw new Error(`Unable to find environment: ${key}`)
			}
		}

		return enVariables
	}
}
