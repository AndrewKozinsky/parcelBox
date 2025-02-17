import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Book } from './book.schema'
import { AddBookInput } from './dto/addBook.input'

export const books = [
	{
		id: 1,
		title: 'Book 1',
		price: 10,
	},
	{
		id: 2,
		title: 'Book 2',
		price: 20,
	},
]

@Resolver(() => Book)
export class BookResolver {
	@Query(() => [Book], { name: 'books' })
	getAllBooks() {
		return books
	}

	@Query(() => Book, { name: 'book' })
	async getBook(@Args('id', { type: () => ID }) id: string) {
		return books.find((book) => book.id === parseInt(id))
	}

	@Mutation(() => Book, { name: 'addBook' })
	addBook(@Args('input') addBookInput: AddBookInput) {
		const newBook = {
			id: books.length + 1,
			title: addBookInput.title,
			price: addBookInput.price,
		}

		books.push(newBook)

		return newBook
	}
}
