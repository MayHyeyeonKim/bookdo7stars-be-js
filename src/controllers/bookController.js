import express from 'express';
import bookService from '../services/bookService.js';
import categoryService from '../services/categoryService.js';

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

const router = express.Router();

/**
 * @swagger
 * /book:
 *   get:
 *     summary: 데이터베이스에 있는 전체 도서 목록을 불러옵니다.
 *     tags: [Get all books]
 *     responses:
 *       200:
 *         description: 전체 도서 목록이 성공적으로 불려졌습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   description: book 객체의 배열
 *                   example: [{
 *                      "title": "book1",
 *                      "isbn": "xxx",
 *                      "author": "author1",
 *                      "cover": "cover1",
 *                      "priceStandard": 100
 *                    },
 *                    {
 *                      "title": "book2",
 *                      "isbn": "xxx2",
 *                      "author": "author2",
 *                      "cover": "cover2",
 *                      "priceStandard": 100
 *                    }]
 *                 message:
 *                   type: string
 *                   description: 응답 메세지
 *                   example: Books loaded successfully
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메세지
 *                   example: Error loading Books
 */
router.get('/', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    const books = await bookService.getAllBooks(req.query, user);
    res.status(200).json({ books: books.rows, count: books.count, message: 'Books loaded successfully' });
  } catch (err) {
    console.error('Error loading books: ', err.message);
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error loading books' });
  }
});

/**
 * @swagger
 * /book/detail/12:
 *   get:
 *     summary: 유저가 요청한 도서 한 권을 DB에서 불러옵니다.
 *     tags: [Get book detail]
 *
 *     responses:
 *       200:
 *         description: 유저가 요청한 도서 한 권을 DB에서 성공적으로 불러왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   type: object
 *                   description: book 객체
 *                   example:
 *                     id: 12
 *                     isbn: "K012933265"
 *                     title: "2025 임재희 응급처치학개론 필드매뉴얼(FM) 법령집"
 *                     author: "임재희 (지은이)"
 *                     description: ""
 *                     cover: "https://image.aladin.co.kr/product/34562/37/coversum/k012933265_1.jpg"
 *                     stockStatus: "예약판매"
 *                     categoryId: "140212"
 *                     mileage: "270"
 *                     categoryName: "국내도서>수험서/자격증>공무원 수험서>소방공무원(승진)>기타 과목"
 *                     publisher: "메가스터디교육(공무원)"
 *                     adult: false
 *                     fixedPrice: true
 *                     priceStandard: "27000"
 *                     priceSales: "24300"
 *                     customerReviewRank: "0"
 *                     queryType: "New"
 *                     deleted: false
 *                 message:
 *                   type: string
 *                   description: 응답 메세지
 *                   example: Book detail loaded successfully
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메세지
 *                   example: Error loading book detail
 */

router.get('/detail/:id', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    const id = req.params.id;
    const book = await bookService.getBookDetailById(id, user);
    res.status(200).json({ book, message: 'Book detail loaded successfully' });
  } catch (err) {
    console.error('Error loading book: ', err.message);
    if (err.errors != null && err.errors[0].message != null) {
      return res.status(500).json({ message: err.errors[0].message });
    }
    if (err.message === 'Book not found') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error loading book detail' });
  }
});

/**
 * @swagger
 * /book/mainpage:
 *   get:
 *     tags: [Get main page books ]
 *     summary: Find books for main page
 *     description: Returns books for main page from the database.
 *     responses:
 *       200:
 *         description: mainpage loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: object
 *                   description: mainbook objects
 *                   example: {
 *                      banner: [
 *                        {id:123, cover:http://localhost:4000/images/banner/images1.jpg},
 *                        {id:345, cover:http://localhost:4000/images/banner/images2.jpg},
 *                      ],
 *                      itemNewSpecial: [
 *                        {
 *                          "title": "book1",
 *                          "isbn": "xxx",
 *                          "author": "author1",
 *                          "cover": "cover1",
 *                          "priceStandard": 100
 *                        },
 *                       ],
 *                       bestSellerCategory: [
 *                          {id:123123, name:"연애"},
 *                          {id:345345, name:"만화"},
 *                       ],
 *                       itemNewAll: [
 *                        {
 *                          "title": "book1",
 *                          "isbn": "xxx",
 *                          "author": "author1",
 *                          "cover": "cover1",
 *                          "priceStandard": 100
 *                        },
 *                       ],
 *                       itemEditorChoice: [
 *                        {
 *                          "title": "book1",
 *                          "isbn": "xxx",
 *                          "author": "author1",
 *                          "cover": "cover1",
 *                          "priceStandard": 100
 *                        },
 *                       ],
 *                    }
 *                 message:
 *                   type: string
 *                   description: response message
 *                   example: mainpage loaded successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Error loading main page
 */
router.get('/mainpage', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    const baseUrl = req.protocol + '://' + req.get('host');
    const banner = await bookService.getBanners(baseUrl);
    const itemNewSpecial = await bookService.getBooksByQueryType('ItemNewSpecial', user, 1, 8);
    const bestSellerCategory = await categoryService.getCategories(2);
    const itemNewAll = await bookService.getBooksByQueryType('ItemNewAll', user, 1, 12);
    const itemEditorChoice = await bookService.getBooksByQueryType('ItemEditorChoice', user, 1, 8);

    const books = { banner, itemNewSpecial, bestSellerCategory, itemNewAll, itemEditorChoice };
    res.status(200).json({ books, message: 'mainpage loaded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading main page' });
  }
});

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Load Bestseller books under a specific category.
 *     tags: [Get Bestseller books with cateogry ID]
 *     responses:
 *       200:
 *         description: BestSeller Books by category Ids loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   description: book array
 *                   example: [{
 *                      "title": "book1",
 *                      "isbn": "xxx",
 *                      "author": "author1",
 *                      "cover": "cover1",
 *                      "priceStandard": 100
 *                    },
 *                    {
 *                      "title": "book2",
 *                      "isbn": "xxx2",
 *                      "author": "author2",
 *                      "cover": "cover2",
 *                      "priceStandard": 100
 *                    }]
 *                 message:
 *                   type: string
 *                   description: 응답 메세지
 *                   example: BestSeller Books by category Ids loaded successfully
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 오류 메세지
 *                   example: Error loading BestSeller Books
 */
router.get('/mainpage/bestseller', async function (req, res) {
  try {
    const user = req.session?.passport?.user;
    const { categoryId, page, pageSize } = req.query;
    const childrenIds = await categoryService.getChildrenIds(categoryId);
    const books = await bookService.getBooksByQueryTypeAndCategoryIds('Bestseller', childrenIds, user, page, pageSize);
    res.status(200).json({ books, message: 'BestSeller Books by category Ids loaded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading BestSeller Books' });
  }
});

/**
 * @swagger
 * /book/{groupName}:
 *   get:
 *     tags: [Get books by query type]
 *     summary: Find books by query type
 *     description: Returns books by query type from the database.
 *     operationId: getBooksByQueryType
 *     parameters:
 *       - name: groupName
 *         in: path
 *         description: The type of book group to fetch, such as 'Bestseller' or 'itemNewAll'
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number to load.
 *         schema:
 *           type: integer
 *           format: int32
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         description: Number of items per page.
 *         schema:
 *           type: integer
 *           format: int32
 *           default: 20
 *     responses:
 *       200:
 *         description: Books by queryType loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   description: array of book objects
 *                   example: [{
 *                      "title": "book1",
 *                      "isbn": "xxx",
 *                      "author": "author1",
 *                      "cover": "cover1",
 *                      "priceStandard": 100
 *                    },
 *                    {
 *                      "title": "book2",
 *                      "isbn": "xxx2",
 *                      "author": "author2",
 *                      "cover": "cover2",
 *                      "priceStandard": 100
 *                    }]
 *                 message:
 *                   type: string
 *                   description: response message
 *                   example: Books by queryType loaded successfully
 *       400:
 *         description: Invalid query type supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid query type
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Error loading books by query type
 */

router.get('/:groupName', async function (req, res) {
  try {
    const groupName = req.params.groupName;
    const { page, pageSize } = req.query;
    const user = req.session?.passport?.user;
    const books = await bookService.getBooksByQueryType(groupName, user, page, pageSize);

    res.status(200).json({ books, message: 'Books by group name loaded successfully' });
  } catch (err) {
    console.error('Error loading books by group name: ', err.message);

    if (err.message === 'Invalid query type' || err.message === 'Query type is missing') {
      return res.status(400).json({ message: err.message });
    }

    if (err.errors && err.errors.length > 0 && err.errors[0].message) {
      return res.status(500).json({ message: err.errors[0].message });
    }

    res.status(500).json({ message: 'Error loading books by group name' });
  }
});

/**
 * @swagger
 * /book/search/{isbn}:
 *   get:
 *     tags: [Get book by ISBN]
 *     summary: Find book by ISBN
 *     description: Returns book by ISBN from the database.
 *     operationId: getBookByIsbn
 *     parameters:
 *       - name: isbn
 *         in: path
 *         description: The type of book to fetch isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book by isbn loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: object
 *                   description: a book objects
 *                   example: {
 *                      "title": "book1",
 *                      "isbn": "xxx",
 *                      "author": "author1",
 *                      "cover": "cover1",
 *                      "priceStandard": 100
 *                    }
 *                 message:
 *                   type: string
 *                   description: response message
 *                   example: Book with 123456789 loaded successfully
 *       400:
 *         description: Invalid isbn supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid isbn
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Error loading book by isbn
 */

router.get('/search/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await bookService.getBookByIsbn(isbn);
    res.status(200).json({ book, message: `Book with ${isbn} loaded successfully` });
  } catch (err) {
    console.error('Error loading book: ', err.message);
    if (err.errors != null && err.errors[0].message != null) {
      return res.status(500).json({ message: err.errors[0].message });
    }
    if (err.message === 'Book not found') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error loading book' });
  }
});

/**
 * @swagger
 * /book/category/{categoryId}:
 *   get:
 *     tags: [Get books by CategoryId]
 *     summary: Find books by CategoryId
 *     description: Returns books by CategoryId from the database.
 *     operationId: getBooksByCategoryId
 *     parameters:
 *       - name: CategoryId
 *         in: path
 *         description: The type of book to fetch CategoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Books by CategoryId loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   description: book 객체의 배열
 *                   example: [{
 *                      "title": "book1",
 *                      "isbn": "xxx",
 *                      "author": "author1",
 *                      "cover": "cover1",
 *                      "categoryId": "cat1",
 *                      "priceStandard": 100
 *                    },
 *                    {
 *                      "title": "book2",
 *                      "isbn": "xxx2",
 *                      "author": "author2",
 *                      "cover": "cover2",
 *                      "categoryId": "cat1",
 *                      "priceStandard": 100
 *                    }]
 *                 message:
 *                   type: string
 *                   description: 응답 메세지
 *                   example: Books loaded successfully
 *       400:
 *         description: Invalid CategoryId supplied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid CategoryId
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Error loading book by CategoryId
 */
router.get('/category/:categoryId', async function (req, res) {
  try {
    const categoryId = req.params.categoryId;
    const { page, pageSize, orderTerm, categoryName } = req.query;
    const childrenIds = await categoryService.getChildrenIds(categoryId);

    const books = await bookService.getBooksByCategoryId(childrenIds, page, pageSize, orderTerm, categoryName);
    res.status(200).json({ books, message: `Books with ${categoryId} loaded successfully` });
  } catch (err) {
    console.error('Error loading books: ', err.message);
    if (err.errors != null && err.errors[0].message != null) {
      return res.status(500).json({ message: err.errors[0].message });
    }
    if (err.message === 'Books not found') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error loading books' });
  }
});

export default router;
