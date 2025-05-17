type CellDimensions = { width: number; height: number; depth: number }

/**
 * Gets array of objects with overall dimensions of cells
 * [
 *     { width: 10; height: 12; depth: 40 },
 *     { width: 10; height: 12; depth: 40 },
 *     { width: 20; height: 24; depth: 40 },
 * ]
 * and returns summary as array of strings:
 * [2 × (10 × 12 × 40), 1 × (10 × 12 × 40)]
 * @param cellTypes
 */
export function convertCellTypeToSummary(cellTypes: CellDimensions[]) {
	const summary: ({ count: number } & CellDimensions)[] = []

	cellTypes.forEach((cellType) => {
		const itemInSummary = summary.find((summaryItem) => {
			return (
				summaryItem.width === cellType.width &&
				summaryItem.height === cellType.height &&
				summaryItem.depth === cellType.depth
			)
		})

		if (itemInSummary) {
			itemInSummary.count++
		} else {
			summary.push({ ...cellType, count: 1 })
		}
	})

	return summary.map((summaryItem) => {
		return `${summaryItem.count} × (${summaryItem.width} × ${summaryItem.height} × ${summaryItem.depth})`
	})
}
