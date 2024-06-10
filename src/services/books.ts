import supabase from '@/supabase'
import {
	type BookSchema,
	Book,
	BookMoreInfo,
	BookFilters,
	ServiceAuthorizer,
} from '@/types'
import { AuthError } from '@supabase/supabase-js'
import { Primitive } from 'type-fest'

class BooksService implements ServiceAuthorizer {
	private readonly queryBuilder: ReturnType<typeof supabase.from>

	constructor() {
		this.queryBuilder = supabase.from('books')
	}

	private select(more?: BookMoreInfo) {
		let select = `
			id,
			title,
			public,
			genre,
			type,
			createdAt,
			updatedAt,
			author:authorId!inner (
				id,
				username,
				avatar
			),
			chapters (
				id,
				title,
				position,
				pages_cnt:pages!inner(count),
			)
		`

		if (more) {
			select += `, ${more}`
		}

		return this.queryBuilder.select(select).eq('chapters.bookId', 'id')
	}

	private async one(id: number) {
		return (await this.select().eq('id', id).single<Book>()).data
	}

	private filter(
		query: ReturnType<typeof this.select>,
		filters: Omit<BookFilters, 'id' | 'orderBy' | 'limit' | 'offset'>,
	) {
		for (const [key, value] of Object.entries(filters)) {
			if (key === 'search') {
				query = query.likeAnyOf(
					'title, description, backStory, genre',
					(value as string).split(/\s+/),
				)
			} else {
				query = query.eq(key, value)
			}
		}

		return query
	}

	async verify(authorId: number, bookId: number) {
		const book = await this.one(bookId)
		return book?.public || book?.author.id === authorId
	}

	async get(filters?: BookFilters, single = false) {
		let query = this.select()

		// Add filters
		if (filters) {
			query = this.filter(query, filters)
		}

		// Add order by
		if (filters?.orderBy) {
			const [field, order] = filters.orderBy.split(',') as [
				string,
				string,
			]
			query = query.order(field, { ascending: order === 'asc' })
		}

		// Add limit and offset
		if (filters?.limit) {
			query = query.range(filters.offset || 0, filters.limit)
		}

		const response = single
			? await query.limit(1).single<Book>()
			: await query.returns<Book[]>()

		if (response.error) {
			return Promise.reject(response.error)
		}

		return {
			data: response.data,
			count: response.count,
			status: response.status,
		}
	}

	async summarize(authorId: number) {
		const summary = {
			books_cnt: {
				public: 0,
				private: 0,
			},
			chapters_cnt: 0,
			pages_cnt: 0,
			words_cnt: 0,
		}

		// Get all books for the author
		const { data, count } = await this.get({ authorId })

		// Count books
		summary.books_cnt.public = (data as Book[]).filter(
			book => book.public,
		).length
		summary.books_cnt.private = count! - summary.books_cnt.public

		// Count chapters, pages and words
		for (const book of data as Book[]) {
			summary.chapters_cnt += book.chapters.length
			summary.pages_cnt += book.chapters.reduce(
				(acc, chapter) => acc + chapter.pages_cnt,
				0,
			)
			summary.words_cnt += book.chapters.reduce(
				(acc, chapter) => acc + chapter.words_cnt,
				0,
			)
		}

		return summary
	}

	async getDistinctVectors<T extends Primitive>(column: keyof Book) {
		const { data, error } = await this.queryBuilder
			.select(column as string)
			.neq(column as string, null)
			.returns<{ [key: string]: T }[]>()

		if (error) {
			return Promise.reject(error)
		}

		return data.map(c => c[column])
	}

	async getGenres() {
		return await this.getDistinctVectors<string>('genre')
	}

	async getTypes() {
		return await this.getDistinctVectors<string>('type')
	}

	async create(authorId: number, book: BookSchema) {
		// check if book with the same title for the same author already exists
		const exists =
			(await this.get({ title: book.title, authorId })).count! > 0

		if (exists) {
			throw new AuthError('Book with the same title already exists.', 409)
		}

		return (
			await this.queryBuilder
				.insert({ ...book, authorId } as never)
				.single<Book>()
		).data
	}

	async update(
		id: number,
		book: Partial<BookSchema> & { authorId?: number },
	) {
		// check if the book exists
		const exists = await this.get({ id, authorId: book.authorId }, true)

		if (!exists) {
			throw new AuthError('Book not found.', 404)
		}

		return (
			await this.queryBuilder
				.update(book as never)
				.eq('id', id)
				.single<Book>()
		).data
	}

	async delete(authorId: number, id: number) {
		// check if the book exists
		const { data: exists } = await this.get({ id, authorId }, true)

		if (!exists) {
			throw new AuthError('Book not found.', 404)
		}

		await this.queryBuilder.delete().eq('id', id)
		return exists
	}

	async togglePublicity(id: number) {
		// check if the book exists
		const exists = await this.one(id)

		if (!exists) {
			throw new AuthError('Book not found.', 404)
		}

		return await this.update(id, { public: !exists.public })
	}

	async transferOwnership(
		id: number,
		data: {
			authorId: number
			newAuthorId: number
		},
	) {
		// check if the book exists
		const exists = await this.one(id)

		if (!exists) {
			throw new AuthError('Book not found.', 404)
		}

		// check if the author owns the book
		if (exists.author.id !== data.authorId) {
			throw new AuthError('You do not own this book.', 403)
		}

		return await this.update(id, { authorId: data.newAuthorId })
	}

	async generateBackStory(id: number) {
		// todo: will use AI to generate a backstory for the book based on the chapters
	}
}

export default BooksService
