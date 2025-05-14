import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: 'http://localhost/graphql',
	generates: {
		'./src/graphql/schema.graphql': {
			plugins: ['schema-ast'],
		},
		'./src/graphql/index.ts': {
			documents: ['./src/graphql/**/*.graphql'],
			plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
			config: {
				dedupeOperationSuffix: true,
				omitOperationSuffix: true,
				avoidOptionals: true,
			},
		},
	},
}

export default config
