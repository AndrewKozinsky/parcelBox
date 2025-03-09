import { CellTypeOutModel } from '../cellType/cellType.out.model'

export type ParcelBoxTypeServiceModel = {
	id: number
	name: string
	cellTypes: CellTypeOutModel[]
}
