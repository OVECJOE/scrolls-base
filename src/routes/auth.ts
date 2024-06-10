import { local, oauth } from '@/controllers'
import { googleAuthSchema, userUpdateSchema } from '@/types'
import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	// Unauthenticated routes
	instance.get('/redirect/google', oauth.redirect)
	instance.post(
		'/login/google',
		{
			schema: {
				body: googleAuthSchema,
			},
		},
		oauth.validate,
	)
	instance.post(
		'/register/google',
		{ schema: googleAuthSchema },
		oauth.create,
	)

	// Authenticated routes
	instance.post('/logout', oauth.invalidate)

	instance.get('/', local.view)
	instance.put('/', { schema: userUpdateSchema }, local.update)
	instance.delete('/', local.delete)

	instance.get('/users', local.list)

	done()
}
