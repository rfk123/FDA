/*

*/
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dataService = require('../services/dataService');

router.get('/historical', auth, async (req, res) => {
  const { symbol, start_date, end_date } = req.query;
  try {
    const data = await dataService.getHistoricalStockPrices(symbol, start_date, end_date);
    res.json(data);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
