import Review from '../models/review.js';
import Book from '../models/book.js';
import User from '../models/user.js';

class ReviewService {
  async getAllReviewsInBook(bookId) {
    if (!bookId) {
      throw new Error('bookId and content are required');
    }

    try {
      const reviews = await Review.findAndCountAll({
        where: { bookId: bookId },
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

      return reviews;
    } catch (err) {
      console.error('Error in loading Reviews:', err.message);
      throw err;
    }
  }

  async addReviewInBook(userId, bookId, content) {
    if (!bookId || !content) {
      throw new Error('bookId and content are required');
    }

    try {
      const reviewDto = {
        bookId: bookId,
        content: content,
        userId: userId,
      };

      const newReview = await Review.create(reviewDto);
      const newReviewWithBookInfo = await Review.findOne({
        where: { bookId: newReview.bookId, userId: newReview.userId },
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

      return newReviewWithBookInfo;
    } catch (err) {
      console.error('Error in adding Review:', err.message);
      throw err;
    }
  }

  async updateReview(userId, bookId, reviewId, content) {
    if (!bookId || !content) {
      throw new Error('bookId and content are required');
    }

    try {
      const existingReview = await Review.findOne({
        where: { id: reviewId, bookId: bookId, userId: userId },
      });

      if (!existingReview) {
        throw new Error('Review not found');
      } else {
        existingReview.content = content;
        await existingReview.save();
        return existingReview;
      }
    } catch (err) {
      console.error('Error in updating Review:', err.message);
      throw err;
    }
  }

  async deleteReview(userId, bookId, reviewId) {
    try {
      await Review.destroy({
        where: { id: reviewId, bookId: bookId, userId: userId },
      });
    } catch (err) {
      console.error('Error in deleting Review:', err.message);
      throw err;
    }
  }
}

export default new ReviewService();
