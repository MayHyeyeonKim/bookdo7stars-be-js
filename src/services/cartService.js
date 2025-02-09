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
      console.error('Error in updating item:', err.message);
      throw err;
    }
  }

  async updateItemInCart(bookId, quantity, userId) {
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
      if (!existingCart) {
        throw new Error('Cart item is not found');
      }
      existingCart.quantity = quantity;
      return await existingCart.save();
    } catch (err) {
      console.error('Error in addItemToCart:', err.message);
      throw err;
    }
  }

  async deleteItemInCart(bookId, userId) {
    if (!bookId) {
      throw new Error('bookId is required');
    }

    try {
      await Cart.destroy({ where: { bookId: bookId, userId: userId } });
    } catch (err) {
      console.error('Error in deleting item:', err.message);
      throw err;
    }
  }
}

export default new CartService();
