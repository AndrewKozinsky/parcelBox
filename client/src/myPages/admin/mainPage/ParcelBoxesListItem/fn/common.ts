import { Maybe } from '../../../../../graphql'

/**
 * It gets array like [1, 2, 3, 4, 5].
 * It returns days of the week: ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.']
 * @param numArr
 */
export function convertNumArrToWeekDaysStr(numArr: null | number[]): string[] {
	if (!numArr) return []

	return numArr.reduce((acc, currentValue) => {
		const weekDaysMap = ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.']
		acc.push(weekDaysMap[currentValue - 1])
		return acc
	}, [] as string[])
}
