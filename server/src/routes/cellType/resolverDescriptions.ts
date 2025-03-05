import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CellTypeResolver } from './cellType.resolver'

export const cellTypeResolversDesc: Record<keyof typeof CellTypeResolver.prototype, string> = {
	create: `Create cell type.
	Possible errors:
	**${errorMessage.cellTypeDidNotCreated}** — parcel cell couldn't create for some reason.`,
}
