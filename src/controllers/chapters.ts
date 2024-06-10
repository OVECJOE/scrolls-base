import { type FastifyReply, type FastifyRequest } from 'fastify'
import { respond, respondErrorly } from '@/helpers'
import services from './services'
import {
	type ChapterSchema,
	type IdSchema,
	Chapter,
	PositionsSchema,
} from '@/types'
import { APIResponseError } from '@/helpers'

export const main = {
	view: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema

			// verify if the user has access to the chapter
			if (
				!services.chapters.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to view this chapter.',
					403,
				)
			}

			const chapter = (await services.chapters.get(
				{ id: parseInt(params.id) },
				true,
			)) as Chapter

			if (!chapter) {
				throw new APIResponseError('Chapter not found.', 404)
			}

			return await reply.send(
				respond({ chapter }, 'Your chapter is ready for you to read.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	list: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { bookId } = request.query as { bookId: string }

			// verify if the user has access to the chapters
			if (
				!services.books.verify(
					request.session.user!.id,
					parseInt(bookId),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to view these chapters.',
					403,
				)
			}

			const chapters = await services.chapters.get({
				bookId: parseInt(bookId),
			})

			return await reply.send(
				respond({ chapters }, 'Here are your chapters.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	create: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { bookId } = request.query as { bookId: string }
			const data = request.body as ChapterSchema

			// confirm if book is owned by the user
			if (
				!services.books.verify(
					request.session.user!.id,
					parseInt(bookId),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to create a chapter in this book.',
					403,
				)
			}

			// create the chapter
			const { data: chapter } = await services.chapters.create(
				parseInt(bookId),
				data.title,
				data.description,
			)

			return await reply.send(
				respond({ chapter }, 'Your chapter has been created.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	update: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { bookId } = request.query as { bookId: string }
			const params = request.params as IdSchema
			const data = request.body as ChapterSchema

			// confirm if book is owned by the user
			if (
				!services.chapters.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to update a chapter in this book.',
					403,
				)
			}

			const chapter = await services.chapters.update(
				parseInt(bookId),
				parseInt(params.id),
				data,
			)

			return await reply.send(
				respond({ chapter }, 'Your chapter has been updated.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	delete: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { bookId } = request.query as { bookId: string }
			const params = request.params as IdSchema

			// confirm if book is owned by the user
			if (
				!services.chapters.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to delete a chapter in this book.',
					403,
				)
			}

			await services.chapters.delete(
				parseInt(bookId),
				parseInt(params.id),
			)

			return await reply
				.status(204)
				.send(respond({}, 'Your chapter has been deleted.'))
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},
}

export const operations = {
	rearrange: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const { bookId } = request.query as { bookId: string }
			const chapters = request.body as PositionsSchema

			// confirm if book is owned by the user
			if (
				!services.books.verify(
					request.session.user!.id,
					parseInt(bookId),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to reorder chapters in this book.',
					403,
				)
			}

			await services.chapters.reorder(parseInt(params.id), chapters)

			return await reply.send(
				respond({}, 'Your chapters have been reordered.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},

	move: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const { bookId } = request.query as { bookId: string }
			const { position } = request.body as { position: number }

			// confirm if book is owned by the user
			if (
				!services.chapters.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to move this chapter.',
					403,
				)
			}

			const chapters = await services.chapters.move(
				parseInt(bookId),
				parseInt(params.id),
				position,
			)

			return await reply.send(
				respond({ chapters }, 'Your chapter has been moved.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply.status(err.status).send(respondErrorly(err))
		}
	},
}
