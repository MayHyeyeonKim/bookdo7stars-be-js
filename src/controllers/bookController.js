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
    const books = await bookService.getAllBooks();
    res.status(200).json({ books: books, message: 'Books loaded successfully' });
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

router.get('/:groupName', async function (req, res) {
  try {
    const groupName = req.params.groupName;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    let books;

    if (!groupName) res.status(500).json({ message: 'need group Name' });

    books = await bookService.getBooksByQueryType(groupName, page, pageSize);
    res.status(200).json({ books: books, message: 'Books loaded successfully' });
  } catch (err) {
    console.error('Error loading books: ', err.message);
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error loading books' });
  }
});

export default router;
