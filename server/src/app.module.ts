import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { EmailAdapterModule } from './infrastructure/email-adapter/email-adapter.module'
import { HashAdapterModule } from './infrastructure/hashAdapter/hash-adapter.module'
import { AuthModule } from './routes/auth/auth.module'
import { MainConfigModule } from './config/mainConfig.module'
import { MainConfigService } from './config/mainConfig.service'
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
				}
			},
		}),
		HashAdapterModule,
		AuthModule,
		TestsModule,
		EmailAdapterModule,
	],
	controllers: [],
	providers: [MainConfigService],
})
export class AppModule {}
