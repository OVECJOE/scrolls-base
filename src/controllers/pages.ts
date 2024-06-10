import { type FastifyReply, type FastifyRequest } from 'fastify'
import { APIResponseError, respond, respondErrorly } from '../helpers'
import services from './services'
import { type IdSchema, PageFilters, Page } from '@/types'

export const pages = {
	list: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { chapterId } = request.query as { chapterId: string }
			const query = request.query as Omit<PageFilters, 'id' | 'chapterId'>

			// verify if the user has access to the pages
			if (
				!services.chapters.verify(
					request.session.user!.id,
					parseInt(chapterId),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to view these pages.',
					403,
				)
			}

			const pages = (await services.pages.get({
				...query,
				chapterId: parseInt(chapterId),
			})) as Page[]

			return await reply.send(
				respond({ pages }, 'Your pages are ready for you to read.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply
				.status(err.status ?? 500)
				.send(respondErrorly(err))
		}
	},

	view: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const { chapterId } = request.query as { chapterId: string }

			// verify if the user has access to the page
			if (
				!services.pages.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to view this page.',
					403,
				)
			}

			const page = await services.pages.get(
				{
					id: parseInt(params.id),
					chapterId: parseInt(chapterId),
				},
				true,
			)

			if (!page) {
				throw new APIResponseError('Page not found.', 404)
			}

			return await reply.send(
				respond({ page }, 'Your page is ready for you to read.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply
				.status(err.status ?? 500)
				.send(respondErrorly(err))
		}
	},

	create: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { chapterId } = request.query as { chapterId: string }
			const body = request.body as { content: string }

			// verify if the user has access to the chapter
			if (
				!services.chapters.verify(
					request.session.user!.id,
					parseInt(chapterId),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to create a page in this chapter.',
					403,
				)
			}

			const page = await services.pages.create(parseInt(chapterId), body)

			return await reply.send(
				respond({ page }, 'Your page has been created.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply
				.status(err.status ?? 500)
				.send(respondErrorly(err))
		}
	},

	update: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const { chapterId } = request.query as { chapterId: string }
			const body = request.body as { content: string }

			// verify if the user has access to the page
			if (
				!services.pages.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to update this page.',
					403,
				)
			}

			const page = await services.pages.update(
				parseInt(chapterId),
				parseInt(params.id),
				body,
			)

			return await reply.send(
				respond({ page }, 'Your page has been updated.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply
				.status(err.status ?? 500)
				.send(respondErrorly(err))
		}
	},

	delete: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const { chapterId } = request.query as { chapterId: string }

			// verify if the user has access to the page
			if (
				!services.pages.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to delete this page.',
					403,
				)
			}

			await services.pages.delete(
				parseInt(chapterId),
				parseInt(params.id),
			)

			return await reply.send(respond({}, 'Your page has been deleted.'))
		} catch (e) {
			const err = e as APIResponseError
			return await reply
				.status(err.status ?? 500)
				.send(respondErrorly(err))
		}
	},

	reposition: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const params = request.params as IdSchema
			const { chapterId } = request.query as { chapterId: string }
			const body = request.body as { position: number }

			// verify if the user has access to the page
			if (
				!services.pages.verify(
					request.session.user!.id,
					parseInt(params.id),
				)
			) {
				throw new APIResponseError(
					'You do not have permission to reposition this page.',
					403,
				)
			}

			const page = await services.pages.reposition(
				parseInt(chapterId),
				parseInt(params.id),
				body.position,
			)

			return await reply.send(
				respond({ page }, 'Your page has been repositioned.'),
			)
		} catch (e) {
			const err = e as APIResponseError
			return await reply
				.status(err.status ?? 500)
				.send(respondErrorly(err))
		}
	},
}
