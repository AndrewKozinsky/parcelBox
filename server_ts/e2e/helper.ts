import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'

export async function makeGraphQLReq(app: INestApplication<App>, query: string) {
	const response = await request(app.getHttpServer()).post('/graphql').send({ query })
	return response.body.data
}
