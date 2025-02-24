import categoryService from '../../src/services/categoryService.js';
import sequelize from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
}));

describe('bookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return categories hierarchy with level 2', async () => {
    sequelize.query.mockResolvedValueOnce([
      [
        { id: 2, name: 'Category 2', parent_id: 1, level: 2, route: 'Category 1>Category 2' },
        { id: 3, name: 'Category 3', parent_id: 1, level: 2, route: 'Category 1>Category 3' },
        { id: 4, name: 'Category 4', parent_id: 2, level: 3, route: 'Category 1>Category 2>Category 4' },
      ],
    ]);

    const result = await categoryService.getCategories(2);

    // 예상되는 결과와 비교
    expect(result).toEqual([
      {
        id: 2,
        name: 'Category 2',
        children: [{ id: 4, name: 'Category 4' }],
      },
      {
        id: 3,
        name: 'Category 3',
        children: [],
      },
    ]);

    expect(sequelize.query).toHaveBeenCalledTimes(1); // 쿼리가 한 번만 호출되었는지 확인
  });

  it('should return children ids', async () => {
    sequelize.query.mockResolvedValueOnce([[{ id: 2 }, { id: 3 }, { id: 4 }]]);

    const result = await categoryService.getChildrenIds(1196);
    expect(result).toEqual([2, 3, 4]);
    expect(sequelize.query).toHaveBeenCalledTimes(1);
  });
});
