import { BooksService, ChaptersService, PagesService } from '@/services'

export default {
	books: new BooksService(),
	chapters: new ChaptersService(),
	pages: new PagesService(),
}
