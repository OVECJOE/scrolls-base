import { type Database } from './database.types'

export { type Database } from './database.types'
export {
	type GoogleAuthSchema,
	googleAuthSchema,
	userUpdateSchema,
	type UserUpdateSchema,
	type BookSchema,
	bookSchema,
	idSchema,
	bookUpdateSchema,
	type BookUpdateSchema,
	type IdSchema,
	chapterIdSchema,
	type ChapterIdSchema,
	chapterSchema,
	type ChapterSchema,
	positionSchema,
	type PositionSchema,
	chaptersPositionSchema,
	type ChaptersPositionSchema,
} from './schemas.types'

export interface ApiResponse<T> {
	data?: T
	message: string
	status: 'success' | 'error'
}

export type User = Database['public']['Tables']['users']['Row']
