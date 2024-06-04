import { type FastifyReply, type FastifyRequest } from 'fastify'
import { AuthError } from '@supabase/supabase-js'
import { respond, respondErrorly } from '../helpers'
import { type BookSchema } from '@/types'
import { type BookUpdateSchema, type IdSchema } from '@/types/schemas.types'
import services from './services'

export const getPublicBooks = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const books = (await services.books.public()) as any[]
		return await reply.send(
			respond(
				{ books },
				`${books.length} books available for you to read.`,
			),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const getPublicBook = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const book = await services.books.public({
			id: parseInt(params.id),
		})
		if (!book) {
			throw new AuthError('Book not found.', 404)
		}

		return await reply.send(
			respond({ book }, 'Your book is ready for you to read.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const getUserBooks = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const { user } = request?.session

		return await reply.send(
			respond(
				{ books: user ? await services.books.get(user.id) : [] },
				'Your books are ready for you to manage.',
			),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const getBook = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const { user } = request.session

		if (user) {
			const params = request.params as IdSchema
			const book = await services.books.get(user.id, {
				id: parseInt(params.id),
			})

			if (!book) {
				throw new AuthError('Book not found.', 404)
			}

			return await reply.send(
				respond({ book }, 'Your book is ready for you to manipulate.'),
			)
		}

		throw new AuthError('User not found.', 404)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const createBook = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const { id } = request.session.user!
		const body = request.body as BookSchema

		const book = await services.books.create(id, {
			title: body.title,
			genre: body.genre,
			public: body.public,
			type: body.type,
			backStory: body.backStory,
			coverPage: body.coverPage,
			description: body.description,
		})

		return await reply.send(
			respond(
				{ book },
				`Your new book "${book.title}" has been created.`,
			),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const updateBook = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const body = request.body as Partial<BookUpdateSchema>

		const { id } = request.session.user!
		const book = await services.books.update(id, parseInt(params.id), body)

		return await reply.send(
			respond({ book }, `Your book "${book.title}" has been updated.`),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const deleteBook = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const { id } = request.session.user!

		const book = await services.books.delete(id, parseInt(params.id))
		return await reply.send(
			respond({ book }, 'Your book has been deleted!'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const showOrHideBook = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const { id } = request.session.user!

		const book = await services.books.publicize(id, parseInt(params.id))
		return await reply.send(
			respond({ book }, `Your book "${book.title}" is now public.`),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}
