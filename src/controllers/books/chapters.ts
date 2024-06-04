import { type FastifyReply, type FastifyRequest } from 'fastify'
import { AuthError } from '@supabase/supabase-js'
import { respond, respondErrorly } from '../helpers'
import services from './services'
import {
	type ChapterSchema,
	type IdSchema,
	type ChapterIdSchema,
	type ChaptersPositionSchema,
} from '@/types'

export const getChapter = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as ChapterIdSchema
		const chapter = await services.chapters.getOne(
			parseInt(params.id),
			parseInt(params.chapterId),
		)

		if (!chapter) {
			throw new AuthError('Chapter not found.', 404)
		}

		return await reply.send(
			respond({ chapter }, 'Your chapter is ready for you to read.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const createChapter = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as ChapterIdSchema
		const { title, description } = request.body as ChapterSchema

		const chapter = await services.chapters.create(
			parseInt(params.id),
			title,
			description,
		)

		return await reply.send(
			respond({ chapter }, 'Your chapter has been created.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const updateChapter = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as ChapterIdSchema
		const data = request.body as ChapterSchema

		const chapter = await services.chapters.update(
			parseInt(params.id),
			parseInt(params.chapterId),
			data,
		)

		return await reply.send(
			respond({ chapter }, 'Your chapter has been updated.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const deleteChapter = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as ChapterIdSchema

		await services.chapters.delete(
			parseInt(params.id),
			parseInt(params.chapterId),
		)

		return await reply.send(respond({}, 'Your chapter has been deleted.'))
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const getChapters = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const chapters = await services.chapters.get(parseInt(params.id))

		return await reply.send(
			respond({ chapters }, 'Here are your chapters.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const reorderChapters = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as IdSchema
		const chapters = request.body as ChaptersPositionSchema

		await services.chapters.reorder(parseInt(params.id), chapters)

		return await reply.send(
			respond({}, 'Your chapters have been reordered.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}

export const moveChapter = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const params = request.params as ChapterIdSchema
		const { position } = request.body as { position: number }

		const chapters = await services.chapters.move(
			parseInt(params.id),
			parseInt(params.chapterId),
			position,
		)

		return await reply.send(
			respond({ chapters }, 'Your chapter has been moved.'),
		)
	} catch (e) {
		const err = e as AuthError
		return await reply.status(err.status ?? 500).send(respondErrorly(err))
	}
}
