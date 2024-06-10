import { Tables } from '@/types/database.types'

export type BookMoreInfo = `${string}, ${string}, ${string}`

export type BookFilters = {
	id?: number
	title?: string
	authorId?: number
	public?: boolean
	search?: string
	genre?: string
	type?: string
	orderBy?: `${'title' | 'genre' | 'createdAt'},${'asc' | 'desc'}`
	limit?: number
	offset?: number
}

export type Book = Omit<Tables<'books'>, 'authorId'> & {
	author: Pick<Tables<'users'>, 'id' | 'username' | 'avatar'>
	chapters: {
		id: number
		title: string
		position: number
		pages_cnt: number
		words_cnt: number
	}[]
}

export type ChapterFilters = {
	id?: number
	bookId?: number
	title?: string
	position?: number
}

export type Chapter = Omit<Tables<'chapters'>, 'bookId'> & {
	book: Pick<Tables<'books'>, 'title' | 'public' | 'type' | 'genre'>
	pages_cnt: number
}

export type PageFilters = {
	id?: number
	chapterId: number
	position?: number
	limit?: number
	offset?: number
	search?: string
}

export type Page = Omit<Tables<'pages'>, 'chapterId'> & {
	chapter: Pick<Tables<'chapters'>, 'title' | 'position' | 'bookId' | 'id'>
}

export interface ServiceAuthorizer {
	verify: (userId: number, id: number) => Promise<boolean>
}
