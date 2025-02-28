import { Prisma } from '@prisma/client'

export type AdminWithUser = Prisma.AdminGetPayload<{
	include: {
		user: true
	}
}>

export type SenderWithUser = Prisma.SenderGetPayload<{
	include: {
		user: true
	}
}>
