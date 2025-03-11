import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { ParcelBoxTypeResolver } from './parcelBoxType.resolver'

export const parcelBoxTypeResolversDesc: Record<keyof typeof ParcelBoxTypeResolver.prototype, string> = {
	create: `Create parcel box type.
	Possible errors:
	**${errorMessage.parcelBoxTypeDidNotCreated}** — parcel box type couldn't create for some reason.`,
	getAll: 'Get all parcel box types.',
}
