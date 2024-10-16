import Book from './book.js';
import BookQueryType from './bookQueryType.js';

Book.hasMany(BookQueryType, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

export { Book, BookQueryType };
