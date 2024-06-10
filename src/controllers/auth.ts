import { respond, respondErrorly } from '@/helpers'
import { APIResponseError } from '@/helpers'
import supabase from '@/supabase'
import { type GoogleAuthSchema, type UserUpdateSchema } from '@/types'
import { PrismaClient } from '@prisma/client'
import { type FastifyReply, type FastifyRequest } from 'fastify'

const prisma = new PrismaClient()

export const oauth = {
	redirect: async (_request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					skipBrowserRedirect: true,
					scopes: 'email profile openid',
				},
			})

			if (error) throw error

			reply
				.status(200)
				.send(respond({ redirectUrl: data.url }, 'Redirecting...'))
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status).send(respondErrorly(err))
		}
	},

	create: async (
		request: FastifyRequest<{ Body: GoogleAuthSchema }>,
		reply: FastifyReply,
	) => {
		try {
			const { data, error } = await supabase.auth.getUser(
				request.body.access_token,
			)

			if (error) throw error

			// check if user already exists
			const exists =
				(await prisma.user.count({
					where: { googleId: data.user.id },
				})) > 0

			if (exists) {
				throw new APIResponseError('User already exists.', 409)
			}

			// create user in database
			const newUser = await prisma.user.create({
				data: {
					email: data.user.email!,
					googleId: data.user.id,
					username:
						data.user.user_metadata.name ??
						data.user.email?.split('@')[0].replace('.', '_'),
					createdAt: data.user.created_at,
					avatar:
						data.user.user_metadata.picture ??
						data.user.user_metadata.avatar_url,
				},
			})

			reply
				.status(201)
				.send(
					respond(
						{ user: newUser },
						'Your account has been created!',
					),
				)
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status ?? 500).send(respondErrorly(err))
		}
	},

	validate: async (
		request: FastifyRequest<{ Body: GoogleAuthSchema }>,
		reply: FastifyReply,
	) => {
		try {
			const { data, error } = await supabase.auth.getUser(
				request.body.access_token,
			)

			if (error) throw error

			const user = await prisma.user.findFirst({
				where: { googleId: data.user.id },
			})

			if (!user) {
				throw new APIResponseError(
					'User not found. Please register first.',
					404,
				)
			}

			reply.status(200).send(respond({ user }, 'You are now logged in!'))
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status ?? 500).send(respondErrorly(err))
		}
	},

	invalidate: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const token = request.headers.authorization?.replace('Bearer ', '')
			if (!token) throw new APIResponseError('No token provided.', 400)

			const { error } = await supabase.auth.admin.signOut(token)

			if (error) throw error

			reply.status(200).send(respond(null, 'You are now logged out!'))
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status ?? 500).send(respondErrorly(err))
		}
	},
}

export const local = {
	list: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			// check that the user is an admin
			const { user } = request.session
			if (!user || user.googleId !== process.env.SUPABASE_ADMIN_ID) {
				throw new APIResponseError(
					'You are not authorized to perform this operation.',
					401,
				)
			}

			const users = await prisma.user.findMany()
			reply.status(200).send(respond({ users }, 'Loaded all users.'))
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status).send(respondErrorly(err))
		}
	},

	view: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { data, error } = await supabase.auth.getUser(
				request.headers.authorization?.replace('Bearer ', ''),
			)

			if (error) throw error

			const user = await prisma.user.findFirst({
				where: { email: data.user.email },
			})

			if (!user) {
				throw new APIResponseError('User not found.', 404)
			}

			reply.status(200).send(respond({ user }, 'User details.'))
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status ?? 500).send(respondErrorly(err))
		}
	},

	update: async (
		request: FastifyRequest<{ Body: Partial<UserUpdateSchema> }>,
		reply: FastifyReply,
	) => {
		try {
			if (!request.body.username && !request.body.avatar) {
				throw new APIResponseError(
					'You must provide either a username or an avatar.',
					400,
				)
			}

			const { data, error } = await supabase.auth.getUser(
				request.headers.authorization?.replace('Bearer ', ''),
			)

			if (error) throw error

			const user = await prisma.user.findFirst({
				where: { email: data.user.email },
				select: { id: true, username: true, avatar: true },
			})

			if (!user) {
				throw new APIResponseError('User not found.', 404)
			}

			const updatedUser = await prisma.user.update({
				where: { id: user.id },
				data: {
					username: request.body.username ?? user.username,
					avatar: request.body.avatar ?? user.avatar,
				},
			})

			reply
				.status(200)
				.send(
					respond(
						{ user: updatedUser },
						'Your profile has been updated!',
					),
				)
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status ?? 500).send(respondErrorly(err))
		}
	},

	delete: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { data, error } = await supabase.auth.getUser(
				request.headers.authorization?.replace('Bearer ', ''),
			)

			if (error) throw error

			const user = await prisma.user.findFirst({
				where: { email: data.user.email },
				select: { id: true },
			})

			if (!user) {
				throw new APIResponseError('User not found.', 404)
			}

			await prisma.user.delete({ where: { id: user.id } })
			// delete user from supabase
			await supabase.auth.admin.deleteUser(data.user.id)

			reply
				.status(200)
				.send(respond(null, 'Your account has been deleted!'))
		} catch (e) {
			const err = e as APIResponseError
			reply.status(err.status ?? 500).send(respondErrorly(err))
		}
	},
}
