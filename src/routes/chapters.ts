import {
	createChapter,
	deleteChapter,
	getChapter,
	getChapters,
	moveChapter,
	reorderChapters,
	updateChapter,
} from '@/controllers/books'
import { chapterSchema, idSchema } from '@/types'
import {
	chapterIdSchema,
	chaptersPositionSchema,
	positionSchema,
} from '@/types/schemas.types'
import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	// Authenticated routes
	const authOpts = {
		preHandler: [instance.checkAuth],
	}

	instance.get('/', authOpts, getChapters)
	instance.get('/:chapterId', authOpts, getChapter)
	instance.post(
		'',
		{ ...authOpts, schema: { body: chapterSchema } },
		createChapter,
	)
	instance.put(
		'/:chapterId',
		{ ...authOpts, schema: { body: chapterSchema } },
		updateChapter,
	)
	instance.delete('/:chapterId', authOpts, deleteChapter)
	instance.put(
		'/:chapterId/move',
		{
			...authOpts,
			schema: { body: positionSchema, params: chapterIdSchema },
		},
		moveChapter,
	)
	instance.put(
		'/reorder',
		{
			...authOpts,
			schema: { body: chaptersPositionSchema, params: idSchema },
		},
		reorderChapters,
	)

	done()
}
