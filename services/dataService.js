const axios = require('axios');
const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => {
  console.error('Redis client error', err);
});

client.connect().then(() => {
  console.log('Connected to Redis');
}).catch(err => {
  console.error('Could not connect to Redis', err);
});

async function fetchDataFromAPI(endpoint) {
  console.log(`Fetching data from API: ${endpoint}`);
  try {
    const response = await axios.get(endpoint);
    console.log('Data fetched from API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

async function getCachedData(key) {
  console.log(`Checking cache for key: ${key}`);
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        console.error('Redis get error', err);
        reject(err);
      }
      if (data !== null) {
        console.log('Data found in cache:', data);
        resolve(JSON.parse(data));
      } else {
        console.log('No data found in cache');
        resolve(null);
      }
    });
  });
}

async function cacheData(key, data) {
  console.log(`Caching data with key: ${key}`);
  client.setex(key, 3600, JSON.stringify(data));
}

async function getHistoricalStockPrices(symbol, startDate, endDate) {
  const cacheKey = `historical_${symbol}_${startDate}_${endDate}`;
  let data = await getCachedData(cacheKey);
  if (!data) {
    const endpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.API_KEY}`;
    data = await fetchDataFromAPI(endpoint);
    await cacheData(cacheKey, data);
  }
  return data;
}

module.exports = {
  getHistoricalStockPrices,
};

