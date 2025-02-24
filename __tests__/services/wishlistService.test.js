import wishlistService from '../../src/services/wishlistService.js';
//import sequelize from '../../src/config/db.js';
/*
jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
}));
*/

describe('wishlistService', () => {
  /* beforeEach(() => {
    jest.clearAllMocks();
  });*/

  it('should return wishlist', async () => {
    console.log('test');
    const result = await wishlistService.createWishlist(1, 353709686);
    console.log(result);
    //expect(1).toEqual(1);
  });
});
