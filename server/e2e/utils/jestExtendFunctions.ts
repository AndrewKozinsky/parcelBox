export enum JSRegularTypes {
	string = 'string',
	number = 'number',
	null = 'null',
	undefined = 'undefined',
}

expect.extend({
	/**
	 * How to use:
	 * expect.oneOfTypes(['string', 'null'] as JSRegularTypes[])
	 * It checks that type of passed value corresponds with one of types in passed array.
	 * @param receivedValue
	 * @param expectedTypes
	 */
	oneOfTypes(receivedValue: any, expectedTypes: JSRegularTypes[]) {
		let pass = false

		// console.log({ receivedValue })
		// console.log({ expectedTypes })

		expectedTypes.forEach((expectedType) => {
			if (expectedType === 'null') {
				if (receivedValue === null) {
					pass = true
				}
			} else if (expectedType === 'undefined') {
				if (receivedValue === undefined) {
					pass = true
				}
			} else if (typeof receivedValue === expectedType) {
				pass = true
			}
		})

		if (pass) {
			return {
				message: () =>
					`Expected: ${this.utils.printExpected(expectedTypes)}\nReceived: ${this.utils.printReceived(receivedValue)}`,
				pass: true,
			}
		}

		return {
			message: () =>
				`Expected: ${this.utils.printExpected(expectedTypes)}\nReceived: ${this.utils.printReceived(
					receivedValue,
				)}\n\n${this.utils.diff(expectedTypes, receivedValue)}`,
			pass: false,
		}
	},

	/**
	 * How to use:
	 * expect.arrayContainingAnyNumberOfElems(Number)
	 * It checks that passed value is an array consists on zero or many elements.
	 * And each element is checked with passed matcher. For example: Number.
	 * @param receivedValue
	 * @param expectedType
	 */
	arrayContainingAnyNumberOfElems(receivedValue: any[], expectedType: any) {
		let pass = true

		if (receivedValue.length) {
			receivedValue.forEach((value) => {
				try {
					expect.any(expectedType(value))
				} catch (e) {
					pass = false
				}
			})
		}

		if (pass) {
			return {
				message: () =>
					`Expected: ${this.utils.printExpected(expectedType)}\nReceived: ${this.utils.printReceived(receivedValue)}`,
				pass: true,
			}
		}

		return {
			message: () =>
				`Expected: ${this.utils.printExpected(expectedType)}\nReceived: ${this.utils.printReceived(
					receivedValue,
				)}\n\n${this.utils.diff(expectedType, receivedValue)}`,
			pass: false,
		}
	},
})
