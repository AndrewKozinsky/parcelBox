import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { AuthModule } from './modules/auth.module'
import { AuthResolver } from './resolvers/auth/auth.resolver'
import { BookResolver } from './resolvers/book/book.resolver'
import { MainConfigModule } from './config/mainConfig.module'
import { MainConfigService } from './config/mainConfig.service'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

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
							...(extensions?.fields ? { fields: extensions.fields } : {}),
						}
					},
				}
			},
		}),
		BookResolver,
		AuthResolver,
		AuthModule,
	],
	controllers: [],
	providers: [MainConfigService],
})
export class AppModule {}
