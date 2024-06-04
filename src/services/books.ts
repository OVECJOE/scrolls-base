import { type BookUpdateSchema, type BookSchema } from '@/types'
import { PrismaClient } from '@prisma/client'
import { AuthError } from '@supabase/supabase-js'

interface BooksFilters {
	id?: number
	title?: string
}

class BooksService {
	private readonly prisma: PrismaClient

	constructor() {
		this.prisma = new PrismaClient()
	}

	async public(filters?: BooksFilters) {
		const books = await this.prisma.book.findMany({
			where: { public: true, ...filters },
			select: {
				authorId: false,
				Author: {
					select: { username: true, email: true, avatar: true },
				},
				Chapter: {
					select: {
						_count: true,
						Page: {
							where: {
								words_cnt: { gt: 0 },
							},
							select: { words_cnt: true },
						},
						title: true,
						description: !!filters?.id,
						position: true,
					},
				},
			},
			orderBy: [
				{ createdAt: 'desc' },
				{ genre: 'asc' },
				{ title: 'asc' },
			],
		})

		if (filters?.id) {
			return books[0]
		}

		return books
	}

	async get(authorId: number, filters?: BooksFilters) {
		const books = await this.prisma.book.findMany({
			where: {
				...(filters?.id ? { authorId, id: filters.id } : { authorId }),
				...(filters?.title ? { title: filters.title } : {}),
			},
			select: {
				authorId: false,
				Chapter: {
					select: {
						_count: { select: { Page: true } },
						Page: {
							where: {
								words_cnt: { gt: 0 },
							},
							select: { words_cnt: true },
						},
						title: true,
						description: !!filters?.id,
						position: true,
					},
				},
			},
		})

		// Return the first book if the ID is provided
		if (books.length > 0 && filters?.id) {
			return books[0]
		}

		return books
	}

	async create(authorId: number, book: BookSchema) {
		// check if book with the same title for the same author already exists
		const exists =
			(await this.prisma.book.count({
				where: { title: book.title, authorId },
			})) > 0

		if (exists) {
			throw new AuthError('Book with the same title already exists.', 409)
		}

		return await this.prisma.book.create({
			data: { ...book, authorId },
		})
	}

	async update(
		authorId: number,
		id: number,
		book: Partial<BookUpdateSchema>,
	) {
		// check if the book exists
		const exists = await this.prisma.book.findFirst({
			where: { id, authorId },
		})

		if (!exists) {
			throw new AuthError('Book not found.', 404)
		}

		return await this.prisma.book.update({
			where: { id, authorId },
			data: book,
		})
	}

	async delete(authorId: number, id: number) {
		// check if the book exists
		const exists = await this.prisma.book.findFirst({
			where: { id, authorId },
		})

		if (!exists) {
			throw new AuthError('Book not found.', 404)
		}

		return await this.prisma.book.delete({
			where: { id, authorId },
		})
	}

	async publicize(authorId: number, id: number) {
		// check if the book exists
		const exists = await this.prisma.book.findFirst({
			where: { id, authorId },
		})

		if (!exists) {
			throw new AuthError('Book not found.', 404)
		}

		return await this.prisma.book.update({
			where: { id, authorId },
			data: { public: !exists.public },
		})
	}
}

export default BooksService
