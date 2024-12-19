import Book from './book.js';
import BookQueryType from './bookQueryType.js';
import Cart from './cart.js';
import User from './user.js';

Book.hasMany(BookQueryType, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

Cart.belongsTo(Book, { foreignKey: 'book_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });
Book.hasMany(Cart, { foreignKey: 'book_id', as: 'carts' });

export { Book, BookQueryType, Cart, User };

/**
 * User.hasOne(Cart, { foreignKey: 'user_id', as: 'cart' });

"User는 하나의 Cart(장바구니)를 가지며, Cart 테이블의 user_id를 통해 연결됩니다. 이 관계를 User 모델에서 cart라는 이름으로 참조할 수 있습니다."
Book.hasMany(Cart, { foreignKey: 'book_id', as: 'carts' });

"Book은 여러 개의 Cart(장바구니)에 속할 수 있으며, Cart 테이블의 book_id를 통해 연결됩니다. 이 관계를 Book 모델에서 carts라는 이름으로 참조할 수 있습니다."
 */
