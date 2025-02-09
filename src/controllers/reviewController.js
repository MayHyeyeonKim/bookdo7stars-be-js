import express from 'express';
import reviewService from '../services/reviewService.js';
/**
 * @swagger
 * tags:
 *   name: Review
 *   description: The review managing API
 */

const router = express.Router();

/**
 * @swagger
 * /review:
 *   get:
 *     summary: 데이터베이스에 있는 review들 중에 해당 책의 리뷰을 불러옵니다.
 *     tags: [Get all Reviews of a specific book]
 *     responses:
 *       200:
 *         description: review 목록이 성공적으로 불려졌습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookId:
 *                   type: string
 *                   description: 책의 고유 ID
 *                   example: "123456789"
 *                 reviews:
 *                   type: object
 *                   description: review 배열
 *                   example: [{}]
 *
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
 *                   example: Error loading reviews
 */
router.get('/:bookId', async function (req, res) {
  try {
    const bookId = req.params.bookId;

    const reviews = await reviewService.getAllReviewsInBook(bookId);
    res.status(200).json({ reviews: reviews.rows, count: reviews.count, message: 'Reviews loaded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});
/**
 * @swagger
 * /review:
 *   post:
 *     summary: 책에 리뷰를 추가합니다.
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 bookId:
 *                   type: string
 *                   description: 책의 고유 ID
 *                   example: "123456789"
 *                 content:
 *                   type: string
 *                   description: 리뷰 텍스트
 *                   example: "리뷰 입니다"
 *                 userId:
 *                   type: string
 *                   description: 리뷰를 단 유저 ID
 *                   example: 3
 *     responses:
 *       200:
 *         description: 리뷰가 책에 성공적으로 추가되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   description: 추가된 리뷰들
 *                   reviews:
 *                     type: object
 *                     properties:
 *                       bookId:
 *                          type: string
 *                          description: 책의 고유 ID
 *                          example: "123456789"
 *                       content:
 *                          type: string
 *                          description: 리뷰 텍스트
 *                          example: "리뷰 입니다"
 *                       userId:
 *                          type: string
 *                          description: 리뷰를 단 유저 ID
 *                          example: 3
 *                    message:
 *                      type: string
 *                      description: 결과 메시지
 *                      example: "Review is successfully added"
 *       400:
 *         description: 사용자 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "User Not Found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "Internal Server Error"
 */
router.post('/:bookId', async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const { content } = req.body;

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    const review = await reviewService.addReviewInBook(userFromSession.id, bookId, content);
    res.status(200).json({ review, message: 'review is successfully added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /review/{bookId}/{reviewId}:
 *   put:
 *     summary: 책에 리뷰를 수정합니다.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: 책의 고유 ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 리뷰의 고유 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 리뷰 텍스트
 *                 example: "수정된 리뷰입니다."
 *     responses:
 *       200:
 *         description: 리뷰가 성공적으로 수정되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   type: object
 *                   description: 수정된 리뷰 정보
 *                   properties:
 *                     bookId:
 *                       type: string
 *                       description: 책의 고유 ID
 *                       example: "123456789"
 *                     content:
 *                       type: string
 *                       description: 리뷰 텍스트
 *                       example: "수정된 리뷰입니다."
 *                     userId:
 *                       type: string
 *                       description: 리뷰를 단 유저 ID
 *                       example: 3
 *                 message:
 *                   type: string
 *                   description: 결과 메시지
 *                   example: "Review is successfully updated"
 *       400:
 *         description: 사용자 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "User Not Found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "Internal Server Error"
 */
router.put('/:bookId/:reviewId', async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;
    const { content } = req.body;

    console.log(req.session);
    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    const review = await reviewService.updateReview(userFromSession.id, bookId, reviewId, content);
    res.status(200).json({ review, message: 'review is successfully added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /review/{bookId}/{reviewId}:
 *   delete:
 *     summary: 책에서 리뷰를 삭제합니다.
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: 책의 고유 ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 리뷰의 고유 ID
 *     responses:
 *       200:
 *         description: 리뷰가 성공적으로 삭제되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                   example: "Review is successfully deleted"
 *       400:
 *         description: 사용자 정보를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "User Not Found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "Internal Server Error"
 */
router.delete('/:bookId/:reviewId', async function (req, res) {
  try {
    const bookId = req.params.bookId;
    const reviewId = req.params.reviewId;

    const userFromSession = req.session?.passport?.user;
    if (!userFromSession) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    await reviewService.deleteReview(userFromSession.id, bookId, reviewId);
    res.status(200).json({ message: 'review is successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
