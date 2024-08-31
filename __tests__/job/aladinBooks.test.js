import aladinBooksJob from '../../src/job/SaveAladinBooks';

describe('getAladinBooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch books from Aladin API the correct number of times', async () => {
    jest.spyOn(aladinBooksJob, 'getAladinBooksCountByQueryType').mockImplementation(() => 987);
    jest.spyOn(aladinBooksJob, 'fetchAladinBooksByQueryType').mockImplementation(() => []);

    // getAladinBooks 함수 호출
    await aladinBooksJob.getAladinBooks('ItemNewAll');

    // getAladinBooksCountByQueryType가 정확한 queryType으로 호출되었는지 확인
    expect(aladinBooksJob.getAladinBooksCountByQueryType).toHaveBeenCalledWith('ItemNewAll');

    // 총 100개의 도서, 페이지당 50개이므로 fetchAladinBooksByQueryType이 2번 호출되어야 함
    expect(aladinBooksJob.fetchAladinBooksByQueryType).toHaveBeenCalledTimes(20);
  });
});
