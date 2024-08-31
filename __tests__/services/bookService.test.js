import bookService from '../../src/services/bookService';
import Book from '../../src/models/book';

// Mock the Book model
jest.mock('../../src/models/book');

describe('bookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load all books in Book table in the database', async () => {
    const mockBooks = [
      {
        id: '1',
        isbn: 'xxx',
        title: 'book1',
        author: 'author1',
        description: 'description1',
        cover: 'cover1',
        stockStatus: 'xx',
        categoryId: 'id1',
        mileage: 1,
        categoryName: 'cat1',
        publisher: 'publisher1',
        adult: true,
        fixedPrice: true,
        priceStandard: 100,
        priceSales: 90,
        customerReviewRank: 10,
        queryType: 'queryType1',
        deleted: false,
      },
      {
        id: '2',
        isbn: 'xxx2',
        title: 'book2',
        author: 'author2',
        description: 'description2',
        cover: 'cover2',
        stockStatus: 'xx2',
        categoryId: 'id2',
        mileage: 2,
        categoryName: 'cat1',
        publisher: 'publisher2',
        adult: true,
        fixedPrice: true,
        priceStandard: 100,
        priceSales: 90,
        customerReviewRank: 10,
        queryType: 'queryType1',
        deleted: false,
      },
    ];
    Book.findAll.mockResolvedValue(mockBooks);

    const result = await bookService.getAllBooks();

    expect(result).toEqual(mockBooks);
  });
});
