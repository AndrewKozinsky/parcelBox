import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'

export async function makeGraphQLReq(app: INestApplication<App>, query: string) {
	const response = await request(app.getHttpServer())
		.post('/graphql')
		.set(
			'User-Agent',
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
		)
		.send({ query })
	return response.body
}
