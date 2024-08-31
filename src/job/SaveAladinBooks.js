import cron from 'node-cron';
import sequelize from '../config/db.js';

import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';
// Schedule a job to run every minute
dotenv.config();

cron.schedule('0 12 * * *', async () => {
  console.log('Job running every minute');
  const obj = new AladinBooksJob();
  await obj.getAladinBooks('ItemNewAll');
  await obj.getAladinBooks('ItemNewSpecial');
  await obj.getAladinBooks('ItemEditorChoice');
  await obj.getAladinBooks('Bestseller');
  await obj.getAladinBooks('BlogBest');
});

class AladinBooksJob {
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
    const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&MaxResults=50&start=${page}&SearchTarget=Book&output=xml&Version=20131101&Sort=PublishTime`;
    // Fetch the data from the URL
    const response = await axios.get(url);

    // Parse the XML data
    const parsedData = await parseStringPromise(response.data);
    for (let i = 0; i < parsedData.object.item.length; i++) {
      try {
        await sequelize.query(
          `
          INSERT INTO aladinbooks (
            itemId, title, link, author, pubDate, description, isbn, isbn13, priceSales, 
            priceStandard, mallType, stockStatus, mileage, cover, categoryId, categoryName, 
            publisher, salesPoint, adult, fixedPrice, customerReviewRank
          ) VALUES (
            :itemId, :title, :link, :author, :pubDate, :description, :isbn, :isbn13, :priceSales, 
            :priceStandard, :mallType, :stockStatus, :mileage, :cover, :categoryId, :categoryName, 
            :publisher, :salesPoint, :adult, :fixedPrice, :customerReviewRank
          )
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
            },
            logging: false,
          },
        );
        console.log('Success : ' + queryType + ' : ' + page + ' : ' + parsedData.object.item[i].$.itemId);
      } catch (error) {
        console.error(error.name + ' : ' + queryType + ' : ' + page + ' : ' + parsedData.object.item[i].$.itemId);
      }
    }
    // Send the parsed data as JSON
  }
}

export default new AladinBooksJob();
