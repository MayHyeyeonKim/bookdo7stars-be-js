import Book from '../models/book.js';
import Banner from '../models/banner.js';
import BookQueryType from '../models/bookQueryType.js';
import { QueryType } from '../enum/queryTypeEnum.js';
import { Op, literal } from 'sequelize';

class BookService {
  async getAllBooks(query) {
    const {
      page = 1,
      pageSize = 50,
      category_id,
      searchTerm,
      title,
      author,
      publisher,
      start_date,
      end_date,
      orderTerm,
      start_price,
      end_price,
    } = query;

    const whereCondition = {};
    if (searchTerm) {
      // TODO 통합검색
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${searchTerm}%` } },
        { author: { [Op.like]: `%${searchTerm}%` } },
        { publisher: { [Op.like]: `%${searchTerm}%` } },
      ];
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
    if (category_id) {
      whereCondition.categoryId = category_id;
    }
    if (start_date && end_date) {
      whereCondition.pub_date = {
        [Op.between]: [start_date, end_date],
      };
    }

    if (start_price && end_price) {
      whereCondition.price_sales = {
        [Op.between]: [start_price, end_price],
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
        order = [['price_sales', 'ASC']];
        break;

      case 'rank':
        order = [['customer_review_rank', 'ASC']];
        break;

      case 'publication':
        order = [['pub_date', 'ASC']];
        break;

      case 'name':
        order = [[literal(`title COLLATE "ko-KR-x-icu"`), 'ASC']];
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

  async getBooksByQueryTypeAndCategoryIds(queryType, categoryIds, page = 1, pageSize = 20) {
    if (!queryType) {
      throw new Error('Query type is missing');
    }

    if (!categoryIds) {
      throw new Error('categoryIdsare missing');
    }

    if (!Object.values(QueryType).includes(queryType)) {
      throw new Error('Invalid query type');
    }

    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);

    page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    pageSize = Number.isInteger(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : 20;

    const books = await Book.findAll({
      include: [
        {
          model: BookQueryType,
          where: {
            query_type: queryType,
          }, // Filter by query_type
          required: true, // INNER JOIN
        },
      ],
      where: {
        category_id: {
          [Op.in]: categoryIds,
        },
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return books;
  }

  async getBanners(baseUrl) {
    const banners = await Banner.findAll();
    if (!banners) {
      throw new Error('Banner not found');
    }

    for (let item of banners) {
      item.cover = `${baseUrl}/images/banner/${item.cover}`;
    }

    return banners;
  }
}

export default new BookService();
