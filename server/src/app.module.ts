import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { AddressAdapterModule } from './infrastructure/addressAdapter/address-adapter.module'
import { BrowserModule } from './infrastructure/browserService/browser.module'
import { CookieModule } from './infrastructure/cookieService/cookie.module'
import { EmailAdapterModule } from './infrastructure/emailAdapter/email-adapter.module'
import { HashAdapterModule } from './infrastructure/hashAdapter/hash-adapter.module'
import { JwtAdapterModule } from './infrastructure/jwtAdapter/jwtAdapter.module'
import { AuthModule } from './routes/auth/auth.module'
import { MainConfigModule } from './infrastructure/config/mainConfig.module'
import { MainConfigService } from './infrastructure/config/mainConfig.service'
import { CellTypeModule } from './routes/cellType/cellType.module'
import { HelperModule } from './routes/helper/helper.module'
import { ParcelBoxModule } from './routes/parcelBox/parcelBox.module'
import { ParcelBoxTypeModule } from './routes/parcelBoxType/parcelBoxType.module'
import { InitDataModule } from './routes/initData/initData.module'
import { TestsModule } from './routes/test/tests.module'

@Module({
	imports: [
		MainConfigModule,
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			imports: [MainConfigModule],
			inject: [MainConfigService],
			useFactory(configService: MainConfigService) {
				return {
					playground: configService.get().mode === 'development',
					definitions: {
						path: join(process.cwd(), 'src/graphql.ts'),
					},
					autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
					formatError: (error) => {
						const { message, extensions } = error

						return {
							message, // Custom error message
							code: extensions?.code || 500,
							...(extensions?.fields ? { fields: extensions.fields } : {}),
						}
					},
					context: ({ req, res, connection }) => {
						if (connection) {
							return { req: connection.context } // WebSocket connection
						}
						return { req, res } // HTTP request
					},
					path: '/api/graphql',
				}
			},
		}),
		HashAdapterModule,
		AuthModule,
		ParcelBoxTypeModule,
		CellTypeModule,
		ParcelBoxModule,
		TestsModule,
		EmailAdapterModule,
		AddressAdapterModule,
		BrowserModule,
		CookieModule,
		JwtAdapterModule,
		InitDataModule,
		HelperModule,
	],
	controllers: [],
	providers: [MainConfigService],
})
export class AppModule {}
