import cron from 'node-cron';
import sequelize from '../config/db.js';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';

dotenv.config();

class AladinBooksJob {
  constructor() {
    this.init();
  }

  init() {
    console.log('Start AladinBooksJob init method');
    cron.schedule('* * * * *', async () => {
      console.log('Job running every day');
      const obj = new AladinBooksJob();
      ~(
        // await obj.getAladinBooks('ItemNewAll');
        // await obj.getAladinBooks('ItemNewSpecial');
        // await obj.getAladinBooks('ItemEditorChoice');
        (await obj.getAladinBooks('Bestseller'))
      );
      await obj.getAladinBooks('BlogBest');
    });
  }

  async getAladinBooks(queryType) {
    const queryTypeId = await this.getQueryTypeId(queryType);
    if (!queryTypeId) {
      console.error(`Invalid query type: ${queryType}`);
      return;
    }

    const totalCount = await this.getAladinBooksCountByQueryType(queryType);
    for (let i = 1; i <= Math.ceil(totalCount / 50); i++) {
      await this.fetchAladinBooksByQueryType(queryType, queryTypeId, i);
    }
  }

  async getQueryTypeId(queryType) {
    try {
      const [result] = await sequelize.query(`SELECT id FROM "queryTypes" WHERE type = :queryType LIMIT 1`, {
        replacements: { queryType },
        type: sequelize.QueryTypes.SELECT,
      });
      return result ? result.id : null;
    } catch (error) {
      console.error(`Error fetching queryTypeId for ${queryType}:`, error);
      return null;
    }
  }

  async getAladinBooksCountByQueryType(queryType) {
    const ttbKey = process.env.ALADIN_TTB_KEY;
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&MaxResults=50&start=1&SearchTarget=Book&output=xml&Version=20131101`;
    try {
      const response = await axios.get(url);
      const parsedData = await parseStringPromise(response.data);
      const result = parsedData?.object?.totalResults?.[0];
      return result ? parseInt(result) : 0;
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
      return 0;
    }
  }

  async fetchAladinBooksByQueryType(queryType, queryTypeId, page) {
    const ttbKey = process.env.ALADIN_TTB_KEY;
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&MaxResults=50&start=${page}&SearchTarget=Book&output=xml&Version=20131101&Cover=Big`;

    try {
      const response = await axios.get(url);
      const parsedData = await parseStringPromise(response.data);
      console.log('Parsed data:', parsedData);

      for (let i = 0; i < parsedData.object.item.length; i++) {
        const bookData = {
          itemId: parsedData.object.item[i].$.itemId,
          title: parsedData.object.item[i].title,
          link: parsedData.object.item[i].link,
          author: parsedData.object.item[i].author,
          pubDate: parsedData.object.item[i].pubDate || null,
          description: parsedData.object.item[i].description || null,
          isbn: parsedData.object.item[i].isbn || null,
          isbn13: parsedData.object.item[i].isbn13 || null,
          priceSales: parsedData.object.item[i].priceSales || null,
          priceStandard: parsedData.object.item[i].priceStandard || null,
          mallType: parsedData.object.item[i].mallType || null,
          stockStatus: parsedData.object.item[i].stockStatus || null,
          mileage: parsedData.object.item[i].mileage || null,
          cover: parsedData.object.item[i].cover || null,
          categoryId: parsedData.object.item[i].categoryId || null,
          categoryName: parsedData.object.item[i].categoryName || null,
          publisher: parsedData.object.item[i].publisher || null,
          salesPoint: parsedData.object.item[i].salesPoint || null,
          adult: parsedData.object.item[i].adult || null,
          fixedPrice: parsedData.object.item[i].fixedPrice || null,
          customerReviewRank: parsedData.object.item[i].customerReviewRank || null,
          queryTypeId: queryTypeId,
        };

        console.log('Inserting/updating data:', bookData);

        await sequelize.query(
          `
           INSERT INTO "aladinbooks" (
            "itemId", title, link, author, "pubDate", description, isbn, isbn13, "priceSales", 
            "priceStandard", "mallType", "stockStatus", mileage, cover, "categoryId", "categoryName", 
            publisher, "salesPoint", adult, "fixedPrice", "customerReviewRank", "queryTypeId"
          ) VALUES (
            :itemId, :title, :link, :author, :pubDate, :description, :isbn, :isbn13, :priceSales, 
            :priceStandard, :mallType, :stockStatus, :mileage, :cover, :categoryId, :categoryName, 
            :publisher, :salesPoint, :adult, :fixedPrice, :customerReviewRank, :queryTypeId
          )
          ON CONFLICT ("itemId") 
          DO UPDATE SET 
            title = EXCLUDED.title,
            link = EXCLUDED.link,
            author = EXCLUDED.author,
            "pubDate" = EXCLUDED."pubDate",
            description = EXCLUDED.description,
            isbn = EXCLUDED.isbn,
            isbn13 = EXCLUDED.isbn13,
            "priceSales" = EXCLUDED."priceSales",
            "priceStandard" = EXCLUDED."priceStandard",
            "mallType" = EXCLUDED."mallType",
            "stockStatus" = EXCLUDED."stockStatus",
            mileage = EXCLUDED.mileage,
            cover = EXCLUDED.cover,
            "categoryId" = EXCLUDED."categoryId",
            "categoryName" = EXCLUDED."categoryName",
            publisher = EXCLUDED.publisher,
            "salesPoint" = EXCLUDED."salesPoint",
            adult = EXCLUDED.adult,
            "fixedPrice" = EXCLUDED."fixedPrice",
            "customerReviewRank" = EXCLUDED."customerReviewRank",
            "queryTypeId" = EXCLUDED."queryTypeId"
          `,
          {
            replacements: bookData,
            logging: false,
          },
        );

        console.log('Success : ' + queryType + ' : ' + page + ' : ' + bookData.itemId);
      }
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }
}

export default new AladinBooksJob();
