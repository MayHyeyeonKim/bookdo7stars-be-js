import Book from '../models/book.js';
import Wishlist from '../models/wishlist.js';
import Banner from '../models/banner.js';
import BookQueryType from '../models/bookQueryType.js';
import { QueryType } from '../enum/queryTypeEnum.js';
import { Op, literal } from 'sequelize';

class BookService {
  async getAllBooks(query, user) {
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
      start_rate,
      end_rate,
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

    if (start_rate && end_rate) {
      whereCondition.customer_review_rank = {
        [Op.between]: [start_rate, end_rate],
      };
    }

    const order = this.getOrderType(orderTerm, title);
    const books = await Book.findAndCountAll({
      where: whereCondition,
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      include: [
        {
          model: Wishlist,
          where: { user_id: user ? user.id : null }, // 특정 사용자에 대해 북마크된 책만 가져옴
          required: false, // 외부 조인 (Book은 있지만 Bookmark가 없는 경우도 포함)
          attributes: ['book_id'], // 북마크된 책만 표시하고, 북마크가 없으면 null
        },
      ],
    });

    books.rows = books.rows.map((book) => ({
      ...book.toJSON(),
      isBookmarked: book.wishlists.length > 0, // 북마크가 있으면 true, 없으면 false
    }));
    return books;
  }

  async getBookDetailById(id, user) {
    let book = await Book.findByPk(id, {
      include: [
        {
          model: Wishlist,
          where: { user_id: user ? user.id : null }, // 특정 사용자에 대해 북마크된 책만 가져옴
          required: false, // 외부 조인 (Book은 있지만 Bookmark가 없는 경우도 포함)
          attributes: ['book_id'], // 북마크된 책만 표시하고, 북마크가 없으면 null
        },
      ],
    });

    if (!book) {
      throw new Error('Book not found');
    }
    book = {
      ...book.toJSON(),
      isBookmarked: book.wishlists.length > 0, // 북마크가 있으면 true, 없으면 false
    };
    return book;
  }

  async getBooksByQueryType(queryType, user, page = 1, pageSize = 20) {
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
        {
          model: Wishlist,
          where: { user_id: user ? user.id : null }, // 특정 사용자에 대해 북마크된 책만 가져옴
          required: false, // 외부 조인 (Book은 있지만 Bookmark가 없는 경우도 포함)
          attributes: ['book_id'], // 북마크된 책만 표시하고, 북마크가 없으면 null
        },
      ],
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return books.map((book) => ({
      ...book.toJSON(),
      isBookmarked: book.wishlists.length > 0, // 북마크가 있으면 true, 없으면 false
    }));
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

  async getBooksByQueryTypeAndCategoryIds(queryType, categoryIds, user, page = 1, pageSize = 20) {
    if (!queryType) {
      throw new Error('Query type is missing');
    }

    if (!categoryIds) {
      throw new Error('categoryIds are missing');
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
        {
          model: Wishlist,
          where: { user_id: user ? user.id : null }, // 특정 사용자에 대해 북마크된 책만 가져옴
          required: false, // 외부 조인 (Book은 있지만 Bookmark가 없는 경우도 포함)
          attributes: ['book_id'], // 북마크된 책만 표시하고, 북마크가 없으면 null
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

    return books.map((book) => ({
      ...book.toJSON(),
      isBookmarked: book.wishlists.length > 0, // 북마크가 있으면 true, 없으면 false
    }));
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

  async getBooksByCategoryId(categoryIds, page = 1, pageSize = 20, orderTerm, categoryName) {
    const parsedPage = parseInt(page);
    const parsedPageSize = parseInt(pageSize);

    page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    pageSize = Number.isInteger(parsedPageSize) && parsedPageSize > 0 ? parsedPageSize : 20;
    const order = this.getOrderType(orderTerm, categoryName);
    const books = await Book.findAndCountAll({
      where: {
        category_id: {
          [Op.in]: categoryIds,
        },
      },
      order,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return books;
  }
}

export default new BookService();
