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

  it('should load a book by id in Book table in the database', async () => {
    const mockBookDetail = {
      id: 12,
      isbn: 'K012933265',
      title: '2025 임재희 응급처치학개론 필드매뉴얼(FM) 법령집',
      author: '임재희 (지은이)',
      description: '',
      cover: 'https://image.aladin.co.kr/product/34562/37/coversum/k012933265_1.jpg',
      stockStatus: '예약판매',
      categoryId: '140212',
      mileage: '270',
      categoryName: '국내도서>수험서/자격증>공무원 수험서>소방공무원(승진)>기타 과목',
      publisher: '메가스터디교육(공무원)',
      adult: false,
      fixedPrice: true,
      priceStandard: '27000',
      priceSales: '24300',
      customerReviewRank: '0',
      queryType: 'New',
      deleted: false,
    };

    const spy = jest.spyOn(Book, 'findByPk').mockResolvedValue(mockBookDetail);

    const result = await bookService.getBookDetailById(mockBookDetail.id);

    expect(spy).toHaveBeenCalledWith(mockBookDetail.id);
    expect(result).toEqual(mockBookDetail);

    spy.mockRestore();
  });

  it('should show "Book not found" if the book is not found', async () => {
    const mockBookError = new Error('Book not found');

    jest.spyOn(Book, 'findByPk').mockRejectedValue(mockBookError);

    await expect(bookService.getBookDetailById(1)).rejects.toThrow('Book not found');
  });

  it('should throw an error message if getBookDetailById failed', async () => {
    const mockError = new Error('Error loading book detail');

    jest.spyOn(Book, 'findByPk').mockRejectedValue(mockError);

    await expect(bookService.getBookDetailById(1)).rejects.toThrow('Error loading book detail');
  });

  it('should load books by queryType in Book table in the database and order by pubDate for non-Bestseller queryType', async () => {
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
        queryType: 'ItemNewAll',
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
        queryType: 'ItemNewAll',
        deleted: false,
      },
    ];

    Book.findAll.mockResolvedValue(mockBooks);

    const result = await bookService.getBooksByQueryType('ItemNewAll', 1, 20);

    expect(Book.findAll).toHaveBeenCalledWith({
      where: { queryType: 'ItemNewAll' },
      limit: 20,
      offset: 0,
      order: [['pubDate', 'DESC']],
    });

    expect(result).toEqual(mockBooks);
  });

  it('should load books by queryType and order by salespoint when queryType is Bestseller', async () => {
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
        queryType: 'Bestseller',
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
        queryType: 'Bestseller',
        deleted: false,
      },
    ];

    Book.findAll.mockResolvedValue(mockBooks);

    const result = await bookService.getBooksByQueryType('Bestseller', 1, 20);

    expect(Book.findAll).toHaveBeenCalledWith({
      where: { queryType: 'Bestseller' },
      limit: 20,
      offset: 0,
      order: [['salespoint', 'DESC']],
    });

    expect(result).toEqual(mockBooks);
  });

  it('should throw an error if queryType is not provided', async () => {
    await expect(bookService.getBooksByQueryType(null, 1, 20)).rejects.toThrow('Query type is missing');
    await expect(bookService.getBooksByQueryType('', 1, 20)).rejects.toThrow('Query type is missing');
    await expect(bookService.getBooksByQueryType(undefined, 1, 20)).rejects.toThrow('Query type is missing');
  });

  it('should throw an error if an invalid queryType is provided', async () => {
    await expect(bookService.getBooksByQueryType('InvalidType', 1, 20)).rejects.toThrow('Invalid query type');
  });

  it('should return an empty array if no books are found', async () => {
    Book.findAll.mockResolvedValue([]);
    const result = await bookService.getBooksByQueryType('ItemNewAll', 1, 20);

    expect(Book.findAll).toHaveBeenCalledWith({
      where: { queryType: 'ItemNewAll' },
      limit: 20,
      offset: 0,
      order: [['pubDate', 'DESC']],
    });

    expect(result).toEqual([]);
  });

  it('should throw an error if getting books from DB fails', async () => {
    Book.findAll.mockRejectedValue(new Error('Database error'));

    await expect(bookService.getBooksByQueryType('Bestseller', 1, 20)).rejects.toThrow('Database error');
  });
});
