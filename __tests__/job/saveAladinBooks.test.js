import aladinBooksJob from '../../src/job/SaveAladinBooks';

describe('getAladinBooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch books from Aladin API the correct number of times', async () => {
    jest.spyOn(aladinBooksJob, 'getAladinBooksCountByQueryType').mockImplementation(() => 987);
    jest.spyOn(aladinBooksJob, 'fetchAladinBooksByQueryType').mockImplementation(() => []);
    await aladinBooksJob.getAladinBooks('ItemNewAll');
    expect(aladinBooksJob.getAladinBooksCountByQueryType).toHaveBeenCalledWith('ItemNewAll');
    expect(aladinBooksJob.fetchAladinBooksByQueryType).toHaveBeenCalledTimes(20);
  });
});
