import { type Static, Type, Optional } from '@sinclair/typebox'

export const googleAuthSchema = Type.Object({
	access_token: Type.String({ minLength: 1 }),
})

export const userUpdateSchema = Type.Object({
	username: Type.String(),
	avatar: Type.String(),
})

export const bookSchema = Type.Object({
	title: Type.String({ minLength: 1, maxLength: 255 }),
	genre: Type.String({ minLength: 1, maxLength: 32 }),
	type: Type.String({ minLength: 1 }),
	public: Optional(Type.Boolean()),
	coverPage: Optional(Type.String()),
	description: Optional(Type.String()),
	backStory: Optional(Type.String()),
})

export const bookUpdateSchema = Type.Object({
	title: Optional(Type.String({ minLength: 1, maxLength: 255 })),
	genre: Optional(Type.String({ minLength: 1, maxLength: 32 })),
	type: Optional(Type.String({ minLength: 1 })),
	coverPage: Optional(Type.String()),
	description: Optional(Type.String()),
	backStory: Optional(Type.String()),
})

export const chapterIdSchema = Type.Object({
	id: Type.String({ minLength: 1 }),
	chapterId: Type.String({ minLength: 1 }),
})

export const chapterSchema = Type.Object({
	title: Optional(Type.String({ minLength: 1 })),
	description: Optional(Type.String()),
})

export const pageSchema = Type.Object({
	content: Type.String({ minLength: 1, maxLength: 3000 }),
	has_annotations: Type.Optional(Type.Boolean()),
})

export const positionSchema = Type.Object({
	position: Type.Number(),
})

export const chaptersPositionSchema = Type.Array(
	Type.Object({
		id: Type.Number(),
		position: Type.Number(),
	}),
)

export const pageIdSchema = Type.Object({
	id: Type.String({ minLength: 1 }),
	pageId: Type.String({ minLength: 1 }),
})

export const pagePositionSchema = Type.Object({
	position: Type.Number(),
})

export const idSchema = Type.Object({
	id: Type.String({ minLength: 1 }),
})

export type GoogleAuthSchema = Static<typeof googleAuthSchema>
export type UserUpdateSchema = Static<typeof userUpdateSchema>
export type BookSchema = Static<typeof bookSchema>
export type IdSchema = Static<typeof idSchema>
export type BookUpdateSchema = Static<typeof bookUpdateSchema>
export type ChapterIdSchema = Static<typeof chapterIdSchema>
export type ChapterSchema = Static<typeof chapterSchema>
export type PositionSchema = Static<typeof positionSchema>
export type ChaptersPositionSchema = Static<typeof chaptersPositionSchema>
export type PageSchema = Static<typeof pageSchema>
export type PageIdSchema = Static<typeof pageIdSchema>
export type PagePositionSchema = Static<typeof pagePositionSchema>
