import { Injectable } from '@nestjs/common'
import { Request } from 'express'
const useragent = require('express-useragent')
import { MainConfigService } from '../config/mainConfig.service'

@Injectable()
export class BrowserService {
	constructor(private mainConfig: MainConfigService) {}

	// Returns client's device IP
	getClientIP(req: Request): string {
		return req.header('x-forwarded-for') || req.socket.remoteAddress || 'unknown'
	}

	// Returns client's device name
	getClientName(req: Request): string {
		const source = req.headers['user-agent'] || ''

		const browserInfo = useragent.parse(source)

		return browserInfo.browser + ' ' + browserInfo.version
	}

	// Returns client's device name
	/*isReqFromLocalhost(req: Request): boolean {
		const header = req.rawHeaders.find((header) => header.includes('localhost'))
		return Boolean(header)!!
	}*/
}
