import Book from '../models/book.js';
import BookQueryType from '../models/bookQueryType.js';
import { QueryType } from '../enum/queryTypeEnum.js';
import { Op, literal } from 'sequelize';

class BookService {
  async getAllBooks(page = 1, pageSize = 50, searchTerm, title, author, publisher, start_date, end_date, orderTerm) {
    const whereCondition = {}; //데이터베이스에서 책을 검색할 때 적용할 필터 조건들을 담은 객체
    if (searchTerm) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${searchTerm}%` } },
        { author: { [Op.like]: `%${searchTerm}%` } },
        { publisher: { [Op.like]: `%${searchTerm}%` } },
      ]; //searchTerm이 주어졌을 때, 책의 제목(title), 저자(author), 출판사(publisher) 중 하나라도 searchTerm을 포함하면 일치하도록 조건을 설정하는 부분
    }
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
    const order = this.getOrderType(orderTerm, title);
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

  getOrderType(orderTerm, title) {
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
      case 'accuracy':
        order = [[literal(`ts_rank(to_tsvector(title), to_tsquery('${title}'))`), 'DESC']];
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
