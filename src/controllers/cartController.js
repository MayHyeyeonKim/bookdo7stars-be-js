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
    console.log('req.session는??', req.session);

    const userFromSession = req.session?.passport?.user;
    console.log('userFromSession은 뭐지?', userFromSession.id);

    const cartItem = await cartService.addItemToCart(bookId, quantity, userFromSession.id);
    console.log('cartItem', cartItem);
    res.status(200).json({ cartItem, message: `${cartItem.book.title}` + ' is successfully added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async function (req, res) {
  try {
    console.log('백엔드 카트 수량 업데이트 시작!');
    const userFromSession = req.session?.passport?.user;
    console.log('1. userFromSession은 이렇게 생겼다. => ', userFromSession);
    const itemId = req.params.id;
    const { quantity } = req.body;
    console.log(`2. itemId는 => ${itemId}이고, quantity은 => ${quantity}이다`);

    if (!userFromSession || !itemId || !quantity) {
      return res.status(400).json({ message: 'Bad Request: Missing parameters' });
    }

    const updatedCartItem = await cartService.updateItemQuantity(itemId, quantity, userFromSession);
    if (updatedCartItem) {
      res.status(200).json({ cartItem: updatedCartItem, message: 'Quantity updated successfully' });
    } else {
      res.status(400).json({ message: 'Cart item not found' });
    }
  } catch (err) {
    console.error('Error updating cart item quantity: ', err.message);
    res.status(500).json({ message: 'Error loading cart' });
  }
});

router.delete('/:id', async function (req, res) {
  try {
    console.log('delete시작!!!!!!!!!!');
    console.log('req.session는??', req.session);

    /**
     * 1. 세션에서 사용자 Id 가져오기
     * 2. 파라미터에 붙어온 삭제할 아이템id 가져오기
     * 3. 서비스에 요청하여 아이템을 삭제 처리한다
     * 4. 결과에 따라 응답을 처리한다.
     */

    const userFromSession = req.session?.passport?.user;
    console.log('User from session:', userFromSession);
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

export default router;
