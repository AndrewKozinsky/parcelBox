import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { MainConfigService } from '../src/config/mainConfig.service'

const gqlRouteName = '/graphql'
const userAgent =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'

export async function makeGraphQLReq(app: INestApplication<App>, query: string) {
	const response = await request(app.getHttpServer()).post(gqlRouteName).set('User-Agent', userAgent).send({ query })

	return response.body
}

export async function makeGraphQLReqWithRefreshToken(props: {
	app: INestApplication<App>
	query: string
	refreshTokenStr: string
	mainConfig: MainConfigService
}) {
	const response = await request(props.app.getHttpServer())
		.post(gqlRouteName)
		.set('User-Agent', userAgent)
		.set('Cookie', props.mainConfig!.get().refreshToken.name + '=' + props.refreshTokenStr)
		.send({ query: props.query })

	return response.body
}
