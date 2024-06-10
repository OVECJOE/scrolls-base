import supabase from '@/supabase'
import { Page, PageFilters, ServiceAuthorizer, type PageSchema } from '@/types'
import { PrismaClient } from '@prisma/client'

class PagesService implements ServiceAuthorizer {
	private readonly queryBuilder: ReturnType<typeof supabase.from>
	private readonly prisma: PrismaClient

	constructor() {
		this.queryBuilder = supabase.from('pages')
		this.prisma = new PrismaClient()
	}

	private select() {
		return this.queryBuilder.select(`
			*,
			chapter:chapterId!inner (
				id,
				title,
				position,
				book:bookId!inner (
					id,
					title,
					authorId,
					public
				)
			)
		`)
	}

	private async one(id: number) {
		return (await this.select().eq('id', id).single<Page>()).data
	}

	private filter(
		query: ReturnType<typeof this.select>,
		filters: Omit<PageFilters, 'id' | 'limit' | 'offset'>,
	) {
		for (const [key, value] of Object.entries(filters)) {
			if (key === 'search') {
				query = query.likeAnyOf(
					'content',
					(value as string).split(/\s+/),
				)
			} else {
				query = query.eq(key, value)
			}
		}

		return query
	}

	async verify(authorId: number, pageId: number) {
		const page = await this.one(pageId)
		if (!page) {
			return false
		}

		// get book authorId
		const book = await this.prisma.book.findUnique({
			where: { id: page.chapter.bookId },
		})

		return book?.public || book?.authorId === authorId
	}

	async get(filters: PageFilters, single = false) {
		let query = this.select()

		query = this.filter(query, filters)

		if (filters.limit) {
			query = query.range(filters?.offset || 0, filters.limit)
		}

		if (single) {
			return (await query.single<Page>()).data
		}

		return (await query.order('position').returns<Page[]>()).data
	}

	async count(filters: PageFilters) {
		let query = this.select()

		query = this.filter(query, filters)

		return (await query).count
	}

	async create(chapterId: number, data: PageSchema) {
		const pages = (await this.get({ chapterId })) as Page[]
		const words_cnt = data.content.split(' ').length

		return (
			await this.queryBuilder
				.insert({
					...data,
					position: pages.length + 1,
					chapterId,
					words_cnt,
				} as never)
				.single()
		).data
	}

	async update(chapterId: number, pageId: number, data: PageSchema) {
		const page = await this.one(pageId)
		const words_cnt = data.content.split(' ').length

		if (page?.chapter.id !== chapterId) {
			throw new Error('Page does not belong to this chapter')
		}

		return (
			await this.queryBuilder
				.update({ ...data, words_cnt } as never)
				.eq('id', pageId)
				.single()
		).data
	}

	async delete(chapterId: number, pageId: number) {
		const page = await this.one(pageId)

		if (page?.chapter.id !== chapterId) {
			throw new Error('Page does not belong to this chapter')
		}

		return (await this.queryBuilder.delete().eq('id', pageId).single()).data
	}

	async deleteAll(chapterId: number) {
		return (await this.queryBuilder.delete().eq('chapterId', chapterId))
			.data
	}

	async reposition(chapterId: number, pageId: number, position: number) {
		const page = await this.one(pageId)

		if (page?.chapter.id !== chapterId) {
			throw new Error('Page does not belong to this chapter')
		}

		const pages = (await this.get({ chapterId })) as Page[]
		const maxPosition = pages.length

		if (position < 1 || position > maxPosition) {
			throw new Error(`Position must be between 1 and ${maxPosition}`)
		}

		const pagePosition = page.position

		if (pagePosition === position) {
			return page
		}

		if (pagePosition < position) {
			for (const p of pages) {
				if (p.id === pageId) {
					continue
				}

				if (p.position > pagePosition && p.position <= position) {
					await this.updatePosition(p.id, p.position - 1)
				}
			}
		} else {
			for (const p of pages) {
				if (p.id === pageId) {
					continue
				}

				if (p.position >= position && p.position < pagePosition) {
					await this.updatePosition(p.id, p.position + 1)
				}
			}
		}

		return await this.updatePosition(pageId, position)
	}

	private async updatePosition(pageId: number, position: number) {
		return (
			await this.queryBuilder
				.update({ position } as never)
				.eq('id', pageId)
				.returns<Page>()
		).data
	}
}

export default PagesService
