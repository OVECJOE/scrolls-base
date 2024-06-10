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
	chapterSchema,
	type ChapterSchema,
	positionSchema,
	type PositionSchema,
	positionsSchema,
	type PositionsSchema,
	pageSchema,
	type PageSchema,
} from './schemas.types'
export {
	type BookMoreInfo,
	type Book,
	type BookFilters,
	type Chapter,
	type ChapterFilters,
	type PageFilters,
	type Page,
	type ServiceAuthorizer,
} from './services.types'

export interface ApiResponse<T> {
	data?: T
	message: string
	status: 'success' | 'error'
}

export type User = Database['public']['Tables']['users']['Row']

export type AuthOpts = {
	preHandler: any[]
	schema: {
		query?: any
		body?: any
		params?: any
	}
}
