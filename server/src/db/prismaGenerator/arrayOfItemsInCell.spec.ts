import { BdConfig } from '../dbConfig/dbConfigType'
import { createSchemaPrisma } from './createSchemaPrisma'

export const bdTestConfig = {
	User: {
		dtoProps: {},
		dbFields: {
			id: {
				type: 'index',
			},
			business_hours: {
				type: 'array',
				arrayItemType: 'number',
				description: 'Array of business hours',
				required: true,
			},
			business_days: {
				type: 'array',
				arrayItemType: 'string',
				description: 'Array of business days',
				required: true,
			},
		},
	},
} satisfies BdConfig.Root

describe.only('createSchemaPrisma', () => {
	it('createSchemaPrisma', () => {
		const expectedPrismaSchema = `generator client {
	provider      = "prisma-client-js"
	binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

datasource db {
	provider = "postgresql"
	url      = env("DB_URL")
}

model User {
	id	Int	@id	@default(autoincrement())
	business_hours	Int[]
	business_days	String[]
}`

		const generatedPrismaSchema = createSchemaPrisma(bdTestConfig)

		expect(generatedPrismaSchema).toBe(expectedPrismaSchema)
	})
})
