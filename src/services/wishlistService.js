import Book from '../models/book.js';
import Wishlist from '../models/wishlist.js';
import { Op } from 'sequelize';

class WishlistService {
  async getWishlist(userId, page, pageSize) {
    const books = await Book.findAndCountAll({
      include: [
        {
          model: Wishlist,
          where: {
            user_id: userId,
          }, // Filter by query_type
          required: true, // INNER JOIN
          attributes: [],
        },
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    return books;
  }

  async toggleWishItem(userId, bookId) {
    const book = await this.getWishItem(userId, bookId);
    if (book) return await this.deleteWishlist(userId, [bookId]);
    return await this.createWishItem(userId, bookId);
  }

  async getWishItem(userId, bookId) {
    const book = await Wishlist.findOne({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });
    return book;
  }

  async createWishItem(userId, bookId) {
    const newWishlistItem = await Wishlist.create({ user_id: userId, book_id: bookId });
    return newWishlistItem;
  }

  async createWishlist(userId, bookIds) {
    const result = [];
    for (const bookId of bookIds) {
      const book = await this.getWishItem(userId, bookId);
      if (book) continue;
      const newWishlistItem = await Wishlist.create({ user_id: userId, book_id: bookId });
      result.push(newWishlistItem);
    }
    return result;
  }

  async deleteWishlist(userId, bookIds) {
    const deleted = await Wishlist.destroy({
      where: {
        user_id: userId,
        book_id: { [Op.in]: bookIds }, // bookId가 bookIds 배열에 포함된 조건
      },
    });
    return deleted;
  }
}

export default new WishlistService();
