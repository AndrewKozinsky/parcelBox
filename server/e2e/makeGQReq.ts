import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { Response } from 'express'
import { MainConfigService } from '../src/config/mainConfig.service'

const gqlRouteName = '/graphql'
const userAgent =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'

/*function base() {
	const supertestRequest = request(props.app.getHttpServer())
		.post(gqlRouteName)

	const response = await request(props.app.getHttpServer())
		.post(gqlRouteName)
		.set('User-Agent', userAgent)
		.set('Cookie', props.mainConfig!.get().refreshToken.name + '=' + props.refreshTokenStr)
		.send({ query: props.query })

	return response.body
}*/

export async function makeGraphQLReq(app: INestApplication<App>, query: string) {
	const response = await request(app.getHttpServer()).post(gqlRouteName).set('User-Agent', userAgent).send({ query })
	console.log(response.headers['set-cookie'])
	// TODO Return cookies also

	// const cookies = registerRes.headers['set-cookie']
	// expect(cookies[0].startsWith('refreshToken')).toBe(true)
	// const refreshToken = cookies[0].split('=')[1]

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

function extractCookies(cookieArray: string[]) {
	const cookieObject: Record<string, any> = {}

	cookieArray.forEach((cookieString) => {
		const parts = cookieString.split(';').map((part) => part.trim())

		if (parts.length === 0) return

		const [key, value] = parts[0].split('=').map((part) => part.trim())
		if (!key) return

		const cookieData: Record<string, any> = { value: decodeURIComponent(value || '') }

		for (let i = 1; i < parts.length; i++) {
			const [attribute, attrValue] = parts[i].split('=').map((part) => part.trim())

			if (!attribute) continue
			switch (attribute.toLowerCase()) {
				case 'max-age':
					cookieData.maxAge = attrValue
					break
				case 'path':
					cookieData.path = attrValue
					break
				case 'expires':
					cookieData.expires = attrValue
					break
				case 'secure':
					cookieData.secure = true
					break
				case 'samesite':
					cookieData.sameSite = attrValue
					break
			}
		}

		cookieObject[key] = cookieData
	})

	return cookieObject
}
