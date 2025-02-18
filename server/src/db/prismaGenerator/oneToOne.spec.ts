import { BdConfig } from '../dbConfig/dbConfigType'
import { createSchemaPrisma } from './createSchemaPrisma'

export const bdTestConfig = {
	User: {
		dtoProps: {},
		dbFields: {
			id: {
				type: 'index',
			},
			email: {
				type: 'email',
				unique: true,
				required: true,
			},
			Sender: {
				type: 'parentOneToOne',
			},
		},
	},
	Sender: {
		dtoProps: {},
		dbFields: {
			id: {
				type: 'index',
			},
			user_id: {
				type: 'childOneToOne',
				thisField: 'user_id',
				foreignTable: 'User',
				foreignField: 'id',
			},
		},
	},
} satisfies BdConfig.Root

describe('createSchemaPrisma', () => {
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
	email	String	@unique
	Sender	Sender?
}

model Sender {
	id	Int	@id	@default(autoincrement())
	user User @relation(fields: [user_id], references: [id])
	user_id Int	@unique
}`

		const generatedPrismaSchema = createSchemaPrisma(bdTestConfig)

		expect(generatedPrismaSchema).toBe(expectedPrismaSchema)
	})
})
