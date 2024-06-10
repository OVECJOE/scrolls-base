import { AuthOpts, idSchema } from '@/types'
import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'

export const genAuthOpts =
	(instance: FastifyInstance) =>
	(useParams = false, body?: any) => {
		const opts: AuthOpts = {
			preHandler: [instance.checkAuth],
			schema: {
				query: Type.Object({
					bookId: Type.String(),
				}),
			},
		}

		if (useParams) {
			opts.schema.params = idSchema
		}

		if (body) {
			opts.schema.body = body
		}

		return opts
	}
