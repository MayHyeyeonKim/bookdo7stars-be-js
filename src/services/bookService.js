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

  async getBooksByQueryType(queryType, page = 1, pageSize = 20) {
    if (!queryType) {
      throw new Error('Query type is missing');
    }

    const validQueryTypes = new Set(['BlogBest', 'ItemNewSpecial', 'Bestseller', 'ItemNewAll']);

    if (!validQueryTypes.has(queryType)) {
      throw new Error('Invalid query type');
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);

    page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    pageSize = Number.isInteger(parsedPageSize) && pageSize > 0 ? pageSize : 20;

    // const order = queryType === 'Bestseller' ? [['salespoint', 'DESC']] : [['pubDate', 'DESC']];

    const order = (() => {
      switch (queryType) {
        case 'Bestseller':
          return [['salesPoint', 'DESC']];
        case 'ItemNewAll':
        case 'ItemNewSpecial': // 또는 [['reviewCount', 'DESC']]
        case 'BlogBest': // return [['rating', 'DESC']]; // 예: 평점 기준
        default:
          return [['pubDate', 'DESC']];
      }
    })();

    const books = await Book.findAll({
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      where: { queryType },
    });
    return books;
  }
}

export default new BookService();
