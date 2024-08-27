import cron from 'node-cron';
import axios from 'axios';
import sequelize from '../../src/config/db.js';
import { getAladinNewItemCount, fetchAladinNewItem } from '../../src/job/SaveAladinBooks.js';

jest.mock('axios');
jest.mock('node-cron');
jest.mock('sequelize');

describe('Scheduled Job Tests', () => {
  beforeAll(() => {
    process.env.ALADIN_TTB_KEY = 'test-ttb-key'; // 테스트용 환경 변수 설정
    console.error = jest.fn(); // console.error 모의화
  });
  beforeEach(() => {
    jest.useFakeTimers(); // 타이머를 모의로 설정
  });

  afterEach(() => {
    jest.clearAllMocks(); // 각 테스트 후 모의 상태 초기화
  });

  it('should schedule a job to run at the correct time', () => {
    require('../../src/job/SaveAladinBooks.js');
    expect(cron.schedule).toHaveBeenCalledWith('0 12 * * *', expect.any(Function));
  });

  it('should fetch Aladin new item count correctly', async () => {
    const mockData = `<object><totalResults>100</totalResults></object>`;
    axios.get.mockResolvedValueOnce({ data: mockData });

    const count = await getAladinNewItemCount();

    expect(count).toBe(100);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('http://www.aladin.co.kr/ttb/api/ItemList.aspx'));
  });

  it('should handle error in fetching Aladin new item count', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    const count = await getAladinNewItemCount();

    expect(count).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing data:', expect.any(Error));
  });

  it('should fetch and insert Aladin new items correctly', async () => {
    const mockData = `
      <object>
        <item itemId="1">
          <title>Test Book</title>
          <link>http://example.com</link>
          <author>Author</author>
          <pubDate>2024-01-01</pubDate>
          <description>Description</description>
          <isbn>1234567890</isbn>
          <isbn13>1234567890123</isbn13>
          <priceSales>1000</priceSales>
          <priceStandard>1500</priceStandard>
          <mallType>Type</mallType>
          <stockStatus>InStock</stockStatus>
          <mileage>10</mileage>
          <cover>CoverImage</cover>
          <categoryId>1</categoryId>
          <categoryName>Category</categoryName>
          <publisher>Publisher</publisher>
          <salesPoint>100</salesPoint>
          <adult>No</adult>
          <fixedPrice>No</fixedPrice>
          <customerReviewRank>5</customerReviewRank>
        </item>
      </object>`;
    axios.get.mockResolvedValueOnce({ data: mockData });

    const result = await fetchAladinNewItem(1);

    expect(result).toBe(true);
    expect(sequelize.query).toHaveBeenCalledTimes(1);
    expect(sequelize.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        replacements: expect.objectContaining({
          itemId: '1', // 문자열로 처리
          title: ['Test Book'], // 배열로 예상
          link: ['http://example.com'], // 배열로 예상
          author: ['Author'], // 배열로 예상
          pubDate: ['2024-01-01'], // 배열로 예상
          description: ['Description'], // 배열로 예상
          isbn: ['1234567890'], // 배열로 예상
          isbn13: ['1234567890123'], // 배열로 예상
          priceSales: ['1000'], // 배열로 예상
          priceStandard: ['1500'], // 배열로 예상
          mallType: ['Type'], // 배열로 예상
          stockStatus: ['InStock'], // 배열로 예상
          mileage: ['10'], // 배열로 예상
          cover: ['CoverImage'], // 배열로 예상
          categoryId: ['1'], // 배열로 예상
          categoryName: ['Category'], // 배열로 예상
          publisher: ['Publisher'], // 배열로 예상
          salesPoint: ['100'], // 배열로 예상
          adult: ['No'], // 배열로 예상
          fixedPrice: ['No'], // 배열로 예상
          customerReviewRank: ['5'], // 배열로 예상
        }),
      }),
    );
  });

  it('should handle error in fetching or inserting Aladin new items', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchAladinNewItem(1);

    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing data:', expect.any(Error));
  });
});
