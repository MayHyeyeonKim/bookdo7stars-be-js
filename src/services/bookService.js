import Book from '../models/book.js';
import BookQueryType from '../models/bookQueryType.js';
import { QueryType } from '../enum/queryTypeEnum.js';

class BookService {
  async getAllBooks(page = 1, pageSize = 50) {
    const order = [
      ['title', 'ASC'],
      ['author', 'DESC'],
    ];

    const books = await Book.findAndCountAll({
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
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

    if (!Object.values(QueryType).includes(queryType)) {
      throw new Error('Invalid query type');
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);

    page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    pageSize = Number.isInteger(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : 20;

    const order = queryType === 'Bestseller' ? [['sales_point', 'DESC']] : [['pub_date', 'DESC']];
    const books = await Book.findAll({
      include: [
        {
          model: BookQueryType,
          where: { query_type: queryType }, // Filter by query_type
          required: true, // INNER JOIN
        },
      ],
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return books;
  }
}

export default new BookService();
