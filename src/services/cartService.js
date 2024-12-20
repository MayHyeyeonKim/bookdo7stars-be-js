import Cart from '../models/cart.js';
import Book from '../models/book.js';
import User from '../models/user.js';
class CartService {
  async getAllItemsInCart(userId) {
    try {
      return await Cart.findAll({
        where: { userId: userId },
        attributes: { exclude: ['bookId', 'userId', 'book_id', 'user_id'] },
        include: [
          {
            model: Book,
            as: 'book',
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  async addItemToCart(bookId, quantity, userId) {
    console.log('cartService.addItemToCart예요! ', bookId, quantity, userId);

    if (!bookId || !quantity) {
      throw new Error('bookId and quantity are requied');
    }

    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    try {
      //sequelize의 메서드(예: findOne, findAll)는 옵션 객체를 인자로 받습니다.
      const existingCart = await Cart.findOne({
        where: { bookId: bookId, userId: userId },
        attributes: { exclude: ['bookId', 'userId', 'book_id', 'user_id'] },
        include: [
          {
            model: Book,
            as: 'book',
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
      if (existingCart) {
        console.log(existingCart);
        existingCart.quantity += quantity;
        await existingCart.save();
        return existingCart;
      }
      const newCartItem = {
        bookId: bookId,
        quantity: quantity,
        userId: userId,
      };
      const newItem = await Cart.create(newCartItem);
      const newItemWithBookInfo = await Cart.findOne({
        where: { bookId: newItem.bookId, userId: newItem.userId },
        attributes: { exclude: ['bookId', 'userId', 'book_id', 'user_id'] },
        include: [
          {
            model: Book,
            as: 'book',
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
      return newItemWithBookInfo;
    } catch (error) {
      console.error('Error in addItemToCart:', error.message);
      throw error;
    }
  }
}

export default new CartService();
