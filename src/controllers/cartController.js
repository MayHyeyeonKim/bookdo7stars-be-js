import express from 'express';
import cartService from '../services/cartService';

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
    const userFromSession = req.session.passport.user;
    if (!userFromSession) {
      throw new Error('user from session is not found');
    }
    console.log('userFromSession이 어떻게 들어와?', userFromSession);
    const cartItems = await cartService.getAllItemsInCart(userFromSession.id);
    res.status(200).json({ cartItems, message: 'CartItems successfully loaded' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

router.post('/', async function (req, res) {
  try {
    console.log('/cart/포스트: ', req.body);
    const { bookId, quantity, user } = req.body;
    console.log('bookId와 quantity는? ', bookId, quantity);

    const userFromSession = req.session.passport.user;
    console.log('user는 이렇게 들어온다: ', user);
    if (userFromSession.name !== user.name) {
      throw new Error('user from req.body does not match with the user from session');
    }
    console.log('userFromSession.id: ', userFromSession.id);

    const cartItem = await cartService.addItemToCart(bookId, quantity, userFromSession.id);
    res.status(200).json({ cartItem, message: 'Cart item successfully added' });
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
