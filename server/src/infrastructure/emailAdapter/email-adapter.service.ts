import { Injectable } from '@nestjs/common'
import { MainConfigService } from '../../config/mainConfig.service'
const sendpulse = require('sendpulse-api')

@Injectable()
export class EmailAdapterService {
	constructor(private mainConfig: MainConfigService) {}

	async sendEmailConfirmationMessage(userEmail: string, confirmationCode: string) {
		const siteName = this.mainConfig.get().site.name
		const domainRoot = this.mainConfig.get().site.domainRoot

		const subject = 'Registration at ' + siteName
		const textMessage = 'Registration at ' + siteName
		const htmlMessage = `
<h1>Thanks for your registration</h1>
<p>To finish registration please confirm your email by follow the link below:
	<a href='https://${domainRoot}/emailConfirmation?code=${confirmationCode}'>confirm email</a>
</p>
<p>
	<a href="https://${domainRoot}/unsubscribe">unsubscribe</a>
</p>`

		// Send an email
		await this.sendEmail(userEmail, subject, textMessage, htmlMessage)
	}

	async sendPasswordRecoveryMessage(userEmail: string, recoveryCode: string) {
		const domainApi = this.mainConfig.get().site.domainRoot

		const subject = 'Password recovery at our web-site'
		const textMessage = 'Password recovery at our web-site'
		const htmlMessage = `
<h1>Password recovery</h1>
<p>To finish password recovery please follow the link below:
  <a href='https://${domainApi}/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
</p>`

		// Send an email
		await this.sendEmail(userEmail, subject, textMessage, htmlMessage)
	}

	async sendEmail(toEmail: string, subject: string, textMessage: string, htmlMessage: string) {
		return new Promise((resolve, reject) => {
			/* https://login.sendpulse.com/settings/#api */
			const API_USER_ID = this.mainConfig.get().emailAdapter.userId
			const API_SECRET = this.mainConfig.get().emailAdapter.secret
			const FROM_NAME = this.mainConfig.get().emailAdapter.fromName
			const FROM_EMAIL = this.mainConfig.get().emailAdapter.fromEmail
			const TOKEN_STORAGE = '/tmp/'

			sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, function () {
				const emailOptions = {
					html: htmlMessage,
					text: textMessage,
					subject: subject,
					from: {
						name: FROM_NAME,
						email: FROM_EMAIL,
					},
					to: [
						{
							email: toEmail,
						},
					],
				}

				try {
					sendpulse.smtpSendMail(() => {
						resolve(null)
					}, emailOptions)
				} catch (err) {
					console.log(err)
					reject()
				}
			})
		})
	}
}
