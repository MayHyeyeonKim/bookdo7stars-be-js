import categoryService from '../../src/services/categoryService';
import sequelize from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
}));

const mockCategory = [
  { id: 2, name: 'Category 2', parent_id: 1, level: 2, route: 'Category 1>Category 2' },
  { id: 3, name: 'Category 3', parent_id: 1, level: 2, route: 'Category 1>Category 3' },
  { id: 4, name: 'Category 4', parent_id: 2, level: 3, route: 'Category 1>Category 2>Category 4' },
];

describe('bookService', () => {
  it('should return categories hierarchy with level 2', async () => {
    sequelize.query.mockResolvedValueOnce([mockCategory]);

    const result = await categoryService.getCategories(2);

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

    expect(sequelize.query).toHaveBeenCalledTimes(1);
  });
});
