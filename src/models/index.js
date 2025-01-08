import Book from './book.js';
import Cart from './cart.js';
import User from './user.js';
import BookQueryType from './bookQueryType.js';

Book.hasMany(BookQueryType, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

Cart.belongsTo(Book, { foreignKey: 'book_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// User 모델
User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' }); // User는 하나의 Cart만 가짐

// Book 모델
Book.hasMany(Cart, { foreignKey: 'book_id', as: 'carts' }); // Book은 여러 Cart에 속할 수 있음

export { Book, BookQueryType, Cart };
