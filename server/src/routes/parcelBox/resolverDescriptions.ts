import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { ParcelBoxResolver } from './parcelBox.resolver'

export const parcelBoxResolversDesc: Record<keyof typeof ParcelBoxResolver.prototype, string> = {
	create: `Create parcel box.
	Possible errors:
	**${errorMessage.parcelBoxTypeDidNotCreated}** — parcel box couldn't create for some reason.`,
	getMyParcelBoxes: 'Get all parcel box of the current user.',
	delete: 'Delete parcel box.',
}
