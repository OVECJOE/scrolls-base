import { type Static, Type } from '@sinclair/typebox'

export const googleAuthSchema = Type.Object({
	access_token: Type.String({ minLength: 1 }),
})

export const userUpdateSchema = Type.Object({
	username: Type.String(),
	avatar: Type.String(),
})

export type GoogleAuthSchema = Static<typeof googleAuthSchema>
export type UserUpdateSchema = Static<typeof userUpdateSchema>
