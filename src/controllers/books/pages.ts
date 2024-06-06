import { type FastifyReply, type FastifyRequest } from 'fastify'
import { AuthError } from '@supabase/supabase-js'
import { respond, respondErrorly } from '../helpers'
import services from './services'
import { type PageSchema, type IdSchema } from '@/types'
import { type PageIdSchema } from '@/types/schemas.types'

export const getPages = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const pages = await services.pages.get(parseInt(params.id))

		return await reply.send(
			respond({ pages }, 'Your pages are ready for you to read.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const getPage = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const params = request.params as PageIdSchema
		const page = await services.pages.getOne(
			parseInt(params.id),
			parseInt(params.pageId),
		)

		if (!page) {
			throw new AuthError('Page not found.', 404)
		}

		return await reply.send(
			respond({ page }, 'Your page is ready for you to read.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const createPage = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const { content } = request.body as { content: string }

		const page = await services.pages.create(parseInt(params.id), content)

		return await reply.send(
			respond({ page }, 'Your page has been created.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const updatePage = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as PageIdSchema
		const data = request.body as PageSchema

		const page = await services.pages.update(
			parseInt(params.id),
			parseInt(params.pageId),
			data,
		)

		return await reply.send(
			respond({ page }, 'Your page has been updated.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const deletePage = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as PageIdSchema

		const page = await services.pages.delete(
			parseInt(params.id),
			parseInt(params.pageId),
		)

		return await reply.send(
			respond({ page }, 'Your page has been deleted.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const updatePagePosition = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as PageIdSchema
		const { position } = request.body as { position: number }

		const page = await services.pages.updatePosition(
			parseInt(params.id),
			parseInt(params.pageId),
			position,
		)

		return await reply.send(
			respond({ page }, 'Your page has been updated.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const deleteAllPages = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema

		await services.pages.deleteAll(parseInt(params.id))

		return await reply.send(respond({}, 'All pages have been deleted.'))
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const deleteOtherPages = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as PageIdSchema

		await services.pages.deleteAllExcept(
			parseInt(params.id),
			parseInt(params.pageId),
		)

		return await reply.send(respond({}, 'Other pages have been deleted.'))
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}
