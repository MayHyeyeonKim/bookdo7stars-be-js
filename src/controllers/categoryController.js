import express from 'express';
import categoryService from '../services/categoryService.js';

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The categories managing API
 */

const router = express.Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: 데이터베이스에 있는 카테고리 목록을 불러옵니다.
 *     tags: [Get all Categories]
 *     responses:
 *       200:
 *         description: 카테고리 목록이 성공적으로 불려졌습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: object
 *                   description: category 배열
 *                   example: [{
 *                              "id": "1230",
 *                              "name": "가정/요리/뷰티",
 *                              "children": [
 *                                  {
 *                                   "id": "53481",
 *                                   "name": "제과제빵"
 *                                  },
 *                                  {
 *                                   "id": "53488",
 *                                   "name": "패션/뷰티"
 *                                  }
 *                               ]
 *                             }]
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
 *                   example: Error loading categories
 */
router.get('/', async function (req, res) {
  try {
    const { level } = req.query;
    const categories = await categoryService.getCategories(level);
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error loading categories: ', err.message);
    if (err.errors != null && err.errors[0].message != null) res.status(500).json({ message: err.errors[0].message });
    else res.status(500).json({ message: 'Error loading categories' });
  }
});

export default router;
