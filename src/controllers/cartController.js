import express from 'express';
import cartService from '../services/cartService.js';

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
    console.log(userFromSession.id);
    const cartItems = await cartService.getAllItemsInCart(userFromSession.id);
    res.status(200).json({ cartItems, message: 'CartItems successfully loaded' });
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

router.post('/', async function (req, res) {
  try {
    console.log('/cart/', req.body);
    const { bookId, quantity } = req.body;
    console.log('req.session', req.session);

    const userFromSession = req.session?.passport?.user;
    console.log('userFromSession', userFromSession.id);
    console.log(userFromSession.id);

    const cartItem = await cartService.addItemToCart(bookId, quantity, userFromSession.id);
    console.log('cartItem', cartItem);
    res.status(200).json({ cartItem, message: `${cartItem.book.title}` + ' is successfully added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    console.log('카트 delete컨트롤러 시작!');
    const userFromSession = req.session?.passport?.user;
    console.log('User from session에 있는 id는 이거다 ==> ', userFromSession.id);
    const itemId = req.params.id;
    if (!itemId) {
      return res.status(400).json({ message: 'Bad Request: Missing item ID' });
    }
    const result = await cartService.deleteItemFromCart(itemId, userFromSession.id);
    if (result) {
      res.status(200).json({ bookId: itemId, message: `Item with ID ${itemId} was successfully deleted` });
    } else {
      res.status(404).json({ message: `Item with ID ${itemId} not found in cart` });
    }
  } catch (err) {
    res.status(500).json({ message: `Error deleting item: ${err.message}` });
  }
});

router.put('/:id', async function (req, res) {
  try {
    console.log('/cart/:id');
  } catch (err) {
    res.status(500).json({ message: 'Error loading cart' });
  }
});

export default router;
