import Book from '../models/book.js';

class BookService {
  async getAllBooks() {
    const books = await Book.findAll();
    return books;
  }

  async getBookDetailById(id) {
    const book = await Book.findByPk(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  async getBooksByQueryType(queryType, page, pageSize) {
    const limit = pageSize;
    const offset = (page - 1) * limit;
    const book = await Book.findAll({ limit, offset, where: { queryType }, order: [['pubDate', 'DESC']] });
    return book;
  }
}

export default new BookService();
