import { BooksService, ChaptersService } from '@/services'

export default {
	books: new BooksService(),
	chapters: new ChaptersService(),
}
