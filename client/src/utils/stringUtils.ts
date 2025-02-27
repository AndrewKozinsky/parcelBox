/**
 * Gets email and returns its domain:
 * user@example.com -> example.com
 * test@sub.domain.org -> sub.domain.org
 * @param email
 */
export function getEmailDomain(email: string): string | null {
	const match = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)
	return match ? match[1] : null
}
