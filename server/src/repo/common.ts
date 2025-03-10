import { Prisma } from '@prisma/client'

export type AdminWithUserPrisma = Prisma.AdminGetPayload<{
	include: {
		user: true
	}
}>

export type SenderWithUserPrisma = Prisma.SenderGetPayload<{
	include: {
		user: true
	}
}>

export type ParcelBoxFullDataPrisma = Prisma.ParcelBoxGetPayload<{
	include: {
		parcel_box_type: true
		Cell: {
			include: {
				cell_type: true
			}
		}
		Location: true
	}
}>

export type ParcelBoxTypeFullDataPrisma = Prisma.ParcelBoxTypeGetPayload<{
	include: {
		CellType: true
	}
}>
