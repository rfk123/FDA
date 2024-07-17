//testing in progress
require('dotenv').config();
const { getHistoricalStockPrices } = require('./services/dataService');

(async () => {
  try {
    const symbol = 'AAPL';  // Replace with any stock symbol you want to test
    const startDate = '2023-01-01';  // Replace with your desired start date
    const endDate = '2023-12-31';  // Replace with your desired end date

    // Fetch historical stock prices
    console.log(`Fetching data for ${symbol} from ${startDate} to ${endDate}...`);
    let data = await getHistoricalStockPrices(symbol, startDate, endDate);
    console.log('Data fetched:', data);

    // Wait for a few seconds and fetch again to test caching
    setTimeout(async () => {
      console.log(`Fetching data for ${symbol} from ${startDate} to ${endDate} again to test caching...`);
      data = await getHistoricalStockPrices(symbol, startDate, endDate);
      console.log('Data fetched from cache:', data);
      process.exit(0);
    }, 5000);  // Wait for 5 seconds before fetching again

  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
})();



