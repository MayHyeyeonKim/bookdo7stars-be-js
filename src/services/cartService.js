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
      console.err(err.message);
    }
  }

  async addItemToCart(bookId, quantity, userId) {
    console.log('SERVICE', bookId, quantity, userId);

    if (!bookId || !quantity) {
      throw new Error('bookId and quantity are required');
    }

    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    try {
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
    } catch (err) {
      console.error('Error in addItemToCart:', err.message);
      throw err;
    }
  }
}

export default new CartService();
