import Book from '../models/book.js';
import BookQueryType from '../models/bookQueryType.js';
import { QueryType } from '../enum/queryTypeEnum.js';
import { Op } from 'sequelize';

class BookService {
  async getAllBooks(
    page = 1,
    pageSize = 50,
    searchTarget,
    searchTerm,
    title,
    author,
    publisher,
    start_date,
    end_date,
    orderTerm,
  ) {
    if (searchTarget) {
      // TODO 통합검색
      // order default로 하기.
      return;
    }

    const order = this.getOrderType(orderTerm);

    const whereCondition = {};
    if (title) {
      whereCondition.title = {
        [Op.like]: `%${title}%`,
      };
    }
    if (author) {
      whereCondition.author = {
        [Op.like]: `%${author}%`,
      };
    }
    if (publisher) {
      whereCondition.publisher = {
        [Op.like]: `%${publisher}%`,
      };
    }
    if (start_date && end_date) {
      whereCondition.pub_date = {
        [Op.between]: [start_date, end_date],
      };
    }

    const books = await Book.findAndCountAll({
      where: whereCondition,
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

  async getBookByIsbn(isbn) {
    const book = await Book.findOne({
      where: { isbn: isbn },
    });
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  getOrderType(orderTerm) {
    let order;
    switch (orderTerm) {
      case 'sales':
        order = [['sales_point', 'ASC']];
        break;

      case 'lowPrice':
        order = [['price_sales', 'DESC']];
        break;

      case 'rank':
        order = [['customer_review_rank', 'ASC']];
        break;

      case 'publication':
        order = [['pub_date', 'ASC']];
        break;

      case 'name':
        order = [['title', 'ASC']];
        break;

      default:
        order = [
          ['title', 'ASC'],
          ['author', 'DESC'],
        ];
    }
    return order;
  }
}

export default new BookService();
