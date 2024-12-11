import express from 'express';

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The cart managing API
 */

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: 데이터베이스에 있는 cart 목록을 불러옵니다.
 *     tags: [Get all Categories]
 *     responses:
 *       200:
 *         description: cart 목록이 성공적으로 불려졌습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: object
 *                   description: cart 배열
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
 *                   example: Error loading categories
 */
router.get('/', async function (req, res) {
  try {
    console.log('/cart/');
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

router.post('/', async function (req, res) {
  try {
    console.log('/cart/');
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

router.put('/:id', async function (req, res) {
  try {
    console.log('/cart/:id');
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    console.log('/cart/:id');
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

export default router;
