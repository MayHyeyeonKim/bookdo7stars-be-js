import Book from './book.js';
import Cart from './cart.js';
import User from './user.js';
import Review from './review.js';
import BookQueryType from './bookQueryType.js';
import Wishlist from './wishlist.js';

Book.hasMany(BookQueryType, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

Book.hasMany(Wishlist, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

User.hasMany(Wishlist, {
  foreignKey: 'user_id',
  sourceKey: 'id',
});

Cart.belongsTo(Book, { foreignKey: 'book_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

Review.belongsTo(Book, { foreignKey: 'book_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// User 모델
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' }); // User는 하나의 Cart만 가짐
User.hasMany(Review, { foreignKey: 'user_id', as: 'review' }); // User는 여러개의 Review를 가질 수 있음
// Book 모델
Book.hasMany(Cart, { foreignKey: 'book_id', as: 'carts' }); // Book은 여러 Cart에 속할 수 있음
Book.hasOne(Review, { foreignKey: 'book_id', as: 'review' });

export { Book, BookQueryType, Cart, User, Wishlist };
