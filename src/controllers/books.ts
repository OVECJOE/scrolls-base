import { type FastifyReply, type FastifyRequest } from 'fastify'
import { respond, respondErrorly } from '@/helpers'
import { Book, BookFilters, type BookSchema, type IdSchema } from '@/types'
import services from './services'
import { APIResponseError } from '@/helpers'

export const publc = {
	list: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { data: books, count } = await services.books.get({
				public: true,
				...(request.query as Omit<BookFilters, 'public' | 'authorId'>),
			})

			return await reply.send(
				respond(
					{ books },
					`${count} book(s) available for you to read.`,
				),
			)
		} catch (e) {
			return await reply
				.status(500)
				.send(respondErrorly(e as APIResponseError))
		}
	},

	view: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema

			// verify if the user has access to the book
			if (
				!services.books.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to view this book.',
					403,
				)
			}

			const { data: book } = await services.books.get({
				id: parseInt(params.id),
			})

			if (!book) {
				throw new APIResponseError('Book not found.', 404)
			}

			return await reply.send(
				respond({ book }, 'Your book is ready for you to read.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},
}

export const author = {
	summary: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const summary = await services.books.summarize(
				request.session.user!.id,
			)

			return await reply.send(
				respond({ summary }, `Summary of your books is ready for you.`),
			)
		} catch (e) {
			return await reply
				.status(500)
				.send(respondErrorly(e as APIResponseError))
		}
	},
	list: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { data: books, count } = await services.books.get({
				authorId: request.session.user!.id,
				...(request.query as Omit<BookFilters, 'authorId'>),
			})

			return await reply.send(
				respond({ books }, `${count} book(s) loaded for you.`),
			)
		} catch (e) {
			return await reply
				.status(500)
				.send(respondErrorly(e as APIResponseError))
		}
	},

	view: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const { data: book } = await services.books.get(
				{
					id: parseInt(params.id),
					authorId: request.session.user!.id,
				},
				true,
			)

			if (!book) {
				throw new APIResponseError('Book not found.', 404)
			}

			return await reply.send(
				respond({ book }, 'Your book is ready for you to manipulate.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	create: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { id } = request.session.user!
			const body = request.body as BookSchema

			const book = await services.books.create(id, body)
			if (!book) {
				throw new APIResponseError('Failed to create book.', 500)
			}

			return await reply.send(
				respond(
					{ book },
					`Your new book "${book.title}" has been created.`,
				),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	update: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const body = request.body as Partial<BookSchema>

			const book = await services.books.update(parseInt(params.id), {
				...body,
				authorId: request.session.user!.id,
			})
			if (!book) {
				throw new APIResponseError('Failed to update book.', 500)
			}

			return await reply.send(
				respond(
					{ book },
					`Your book "${book.title}" has been updated.`,
				),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	delete: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema

			const book = (await services.books.delete(
				request.session.user!.id,
				parseInt(params.id),
			)) as Book

			if (!book) {
				throw new APIResponseError('Failed to delete book.', 500)
			}

			return await reply.send(
				respond(
					{ book },
					`Your book "${book.title}" has been deleted.`,
				),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	togglePublicity: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema

			// verify if the user has access to the book
			if (
				!services.books.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to update this book.',
					403,
				)
			}

			const book = await services.books.togglePublicity(
				parseInt(params.id),
			)
			if (!book) {
				throw new APIResponseError(
					'Failed to toggle book publicity.',
					500,
				)
			}

			return await reply.send(
				respond(
					{ book },
					`Your book "${book.title}" is now ${book.public ? 'public' : 'private'}.`,
				),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	transfer: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const body = request.body as { authorId: number }

			const book = await services.books.transferOwnership(
				parseInt(params.id),
				{
					newAuthorId: body.authorId,
					authorId: request.session.user!.id,
				},
			)
			if (!book) {
				throw new APIResponseError('Failed to transfer book.', 500)
			}

			return await reply.send(
				respond(
					{ book },
					`Your book "${book.title}" has been transferred.`,
				),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},
}

export const details = {
	types: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const types = await services.books.getTypes()

			return await reply.send(
				respond({ types }, 'Available book types loaded.'),
			)
		} catch (e) {
			return await reply
				.status(500)
				.send(respondErrorly(e as APIResponseError))
		}
	},

	genres: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const genres = await services.books.getGenres()

			return await reply.send(
				respond({ genres }, 'Available book genres loaded.'),
			)
		} catch (e) {
			return await reply
				.status(500)
				.send(respondErrorly(e as APIResponseError))
		}
	},
}
