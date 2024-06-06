import {
	createPage,
	getPages,
	updatePage,
	deleteAllPages,
	deleteOtherPages,
	deletePage,
	updatePagePosition,
	getPage,
} from '@/controllers/books'
import { idSchema } from '@/types'
import {
	pageIdSchema,
	pageSchema,
	pagePositionSchema,
} from '@/types/schemas.types'

import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	const authOpts = {
		preHandler: [instance.checkAuth],
	}

	instance.get(
		'/:id',
		{
			...authOpts,
			schema: {
				params: idSchema,
			},
		},
		getPages,
	)

	instance.get(
		'/:id/:pageId',
		{
			...authOpts,
			schema: {
				params: pageIdSchema,
			},
		},
		getPage,
	)

	instance.post(
		'/:id',
		{
			...authOpts,
			schema: {
				params: idSchema,
				body: pageSchema,
			},
		},
		createPage,
	)

	instance.put(
		'/:id/:pageId',
		{
			...authOpts,
			schema: {
				params: pageIdSchema,
				body: pageSchema,
			},
		},
		updatePage,
	)

	instance.delete(
		'/:id',
		{
			...authOpts,
			schema: {
				params: idSchema,
			},
		},
		deleteAllPages,
	)

	instance.delete(
		'/:id/:pageId',
		{
			...authOpts,
			schema: {
				params: pageIdSchema,
			},
		},
		deletePage,
	)

	instance.delete(
		'/:id/other',
		{
			...authOpts,
			schema: {
				params: idSchema,
			},
		},
		deleteOtherPages,
	)

	instance.put(
		'/:id/:pageId/move',
		{
			...authOpts,
			schema: {
				params: pageIdSchema,
				body: pagePositionSchema,
			},
		},
		updatePagePosition,
	)

	done()
}
