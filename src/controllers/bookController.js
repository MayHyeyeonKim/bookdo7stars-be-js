import express from 'express';
import bookService from '../services/bookService.js';

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
 *     summary: "데이터베이스에 있는 전체 도서 목록을 불러옵니다. 쿼리 파라미터에 따라 도서를 검색할 수 있습니다."
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "페이지 번호"
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "한 페이지에 불러올 도서 수"
 *       - in: query
 *         name: searchTarget
 *         schema:
 *           type: string
 *           example: title
 *         description: "검색 대상 (예: title, author, publisher)"
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: JavaScript
 *         description: "검색어"
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *           example: "JavaScript: The Good Parts"
 *         description: "도서 제목"
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *           example: "Douglas Crockford"
 *         description: "도서 저자"
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *           example: "O'Reilly Media"
 *         description: "출판사"
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2022-01-01"
 *         description: "출간 시작일"
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2022-12-31"
 *         description: "출간 종료일"
 *       - in: query
 *         name: orderTerm
 *         schema:
 *           type: string
 *           example: "priceStandard"
 *         description: "정렬 기준 (예: priceStandard, title)"
 *     responses:
 *       200:
 *         description: "전체 도서 목록이 성공적으로 불려졌습니다."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   description: "book 객체의 배열"
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "JavaScript: The Good Parts"
 *                       isbn:
 *                         type: string
 *                         example: "9780596517748"
 *                       author:
 *                         type: string
 *                         example: "Douglas Crockford"
 *                       cover:
 *                         type: string
 *                         example: "https://example.com/cover.jpg"
 *                       priceStandard:
 *                         type: number
 *                         example: 100
 *                 count:
 *                   type: integer
 *                   description: "전체 도서의 개수"
 *                   example: 100
 *                 message:
 *                   type: string
 *                   description: "응답 메세지"
 *                   example: "Books loaded successfully"
 *       500:
 *         description: "서버 오류"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "오류 메세지"
 *                   example: "Error loading books"
 */

router.get('/', async function (req, res) {
  try {
    const { page, pageSize, searchTarget, searchTerm, title, author, publisher, start_date, end_date, orderTerm } =
      req.query;
    const books = await bookService.getAllBooks(
      page,
      pageSize,
      searchTarget,
      searchTerm,
      title,
      author,
      publisher,
      start_date,
      end_date,
      orderTerm,
    );
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
    const id = req.params.id;
    const book = await bookService.getBookDetailById(id);
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

    const books = await bookService.getBooksByQueryType(groupName, page, pageSize);

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
 *     summary: ISBN을 기준으로 도서를 검색합니다.
 *     tags: [Get book by ISBN]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색할 도서의 ISBN 번호
 *         example: "9780596517748"
 *     responses:
 *       200:
 *         description: 요청한 ISBN을 가진 도서를 성공적으로 불러왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   type: object
 *                   description: 도서 객체
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "JavaScript: The Good Parts"
 *                     isbn:
 *                       type: string
 *                       example: "9780596517748"
 *                     author:
 *                       type: string
 *                       example: "Douglas Crockford"
 *                     cover:
 *                       type: string
 *                       example: "https://example.com/cover.jpg"
 *                     priceStandard:
 *                       type: number
 *                       example: 100
 *                 message:
 *                   type: string
 *                   description: 응답 메세지
 *                   example: "Book with 9780596517748 loaded successfully"
 *       404:
 *         description: 해당 ISBN의 도서를 찾을 수 없습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메세지
 *                   example: "Book not found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메세지
 *                   example: "Error loading book"
 */

router.get('/search/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await bookService.getBookByIsbn(isbn);
    res.status(200).json({ book, message: `Book with ${isbn} loaded successfully` });
  } catch (error) {
    console.error('Error loading book: ', error.message);
    if (error.errors != null && error.errors[0].message != null) {
      return res.status(500).json({ message: error.errors[0].message });
    }
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error loading book' });
  }
});

export default router;
