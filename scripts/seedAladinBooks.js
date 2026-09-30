import sequelize from '../src/config/db.js';
import { AladinBooksJob } from '../src/job/SaveAladinBooks.js';

const job = new AladinBooksJob({ schedule: false });
const requestedGroups = process.argv.slice(2);

try {
  await job.syncAllBooks(requestedGroups.length > 0 ? requestedGroups : undefined);
  console.log('Aladin book sync completed.');
} catch (error) {
  console.error(`Aladin book sync failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
