import Book from './book.js';
import BookQueryType from './bookQueryType';

Book.hasMany(BookQueryType, {
  foreignKey: 'book_id',
  sourceKey: 'id',
});

export { Book, BookQueryType };

// Sequelize에서 모델 간의 (one-to-many) 관계를 정의하는 데 사용되는 메서드
// Book 모델이 여러 개의 BookQueryType 모델과 연관될 수 있다는 것을 정의
// 이 메서드를 사용함으로써 Book과 BookQueryType 사이에 1 관계를 생성
// sourceKey: 'id': Book 테이블에서 관계를 맺을 때 사용할 컬럼을 지정합니다. 여기서는 Book 모델의 id 컬럼을 사용
