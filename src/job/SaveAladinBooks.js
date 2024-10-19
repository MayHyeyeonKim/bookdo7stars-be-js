import sequelize from '../config/db.js';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';
// dotenv 설정
dotenv.config();

class AladinBooksJob {
  constructor() {
    console.log('start AladinBooksJob');
  }

  async getAladinBooks(queryType) {
    const totalCount = await this.getAladinBooksCountByQueryType(queryType);
    for (let i = 1; i <= Math.ceil(totalCount / 50); i++) {
      await this.fetchAladinBooksByQueryType(queryType, i);
    }
  }

  async getAladinBooksCountByQueryType(queryType) {
    const ttbKey = process.env.ALADIN_TTB_KEY;
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&MaxResults=50&start=1&SearchTarget=Book&output=xml&Version=20131101`;
    try {
      const response = await axios.get(url);
      const parsedData = await parseStringPromise(response.data);
      const result = parsedData?.object?.totalResults?.[0];
      if (result) return parseInt(result);
      return result;
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
    }
  }

  async fetchAladinBooksByQueryType(queryType, page) {
    const ttbKey = process.env.ALADIN_TTB_KEY;
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&MaxResults=50&start=${page}&SearchTarget=Book&output=xml&Version=20131101&Cover=Big`;
    const response = await axios.get(url);
    const parsedData = await parseStringPromise(response.data);
    for (let i = 0; i < parsedData.object.item.length; i++) {
      try {
        await sequelize.query(
          `
          INSERT INTO aladinbooks (
            item_id, title, link, author, pub_date, description, isbn, isbn13, price_sales, 
            price_standard, mall_type, stock_status, mileage, cover, category_id, category_name, 
            publisher, sales_point, adult, fixed_price, customer_review_rank, query_type
          ) VALUES (
            :itemId, :title, :link, :author, :pubDate, :description, :isbn, :isbn13, :priceSales, 
            :priceStandard, :mallType, :stockStatus, :mileage, :cover, :categoryId, :categoryName, 
            :publisher, :salesPoint, :adult, :fixedPrice, :customerReviewRank, :queryType
          )
          ON CONFLICT (item_id, query_type) DO UPDATE SET
                    title = EXCLUDED.title,
                    link = EXCLUDED.link,
                    author = EXCLUDED.author,
                    pub_date = EXCLUDED.pub_date,
                    description = EXCLUDED.description,
                    isbn = EXCLUDED.isbn,
                    isbn13 = EXCLUDED.isbn13,
                    price_sales = EXCLUDED.price_sales,
                    price_standard = EXCLUDED.price_standard,
                    mall_type = EXCLUDED.mall_type,
                    stock_status = EXCLUDED.stock_status,
                    mileage = EXCLUDED.mileage,
                    cover = EXCLUDED.cover,
                    category_id = EXCLUDED.category_id,
                    category_name = EXCLUDED.category_name,
                    publisher = EXCLUDED.publisher,
                    sales_point = EXCLUDED.sales_point,
                    adult = EXCLUDED.adult,
                    fixed_price = EXCLUDED.fixed_price,
                    customer_review_rank = EXCLUDED.customer_review_rank,
                    query_type = EXCLUDED.query_type
        `,
          {
            replacements: {
              itemId: parsedData.object.item[i].$.itemId,
              title: parsedData.object.item[i].title,
              link: parsedData.object.item[i].link,
              author: parsedData.object.item[i].author,
              pubDate: parsedData.object.item[i].pubDate,
              description: parsedData.object.item[i].description,
              isbn: parsedData.object.item[i].isbn,
              isbn13: parsedData.object.item[i].isbn13,
              priceSales: parsedData.object.item[i].priceSales,
              priceStandard: parsedData.object.item[i].priceStandard,
              mallType: parsedData.object.item[i].mallType,
              stockStatus: parsedData.object.item[i].stockStatus,
              mileage: parsedData.object.item[i].mileage,
              cover: parsedData.object.item[i].cover,
              categoryId: parsedData.object.item[i].categoryId,
              categoryName: parsedData.object.item[i].categoryName,
              publisher: parsedData.object.item[i].publisher,
              salesPoint: parsedData.object.item[i].salesPoint,
              adult: parsedData.object.item[i].adult,
              fixedPrice: parsedData.object.item[i].fixedPrice,
              customerReviewRank: parsedData.object.item[i].customerReviewRank,
              queryType: queryType,
            },
            logging: false,
          },
        );
        console.log('Success : ' + queryType + ' : ' + page + ' : ' + parsedData.object.item[i].$.itemId);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// AladinBooksJob 실행
// (async () => {
//   const job = new AladinBooksJob();
//   await job.getAladinBooks('ItemNewAll');
//   await job.getAladinBooks('ItemNewSpecial');
//   await job.getAladinBooks('ItemEditorChoice');
//   await job.getAladinBooks('Bestseller');
//   await job.getAladinBooks('BlogBest');
// })();
