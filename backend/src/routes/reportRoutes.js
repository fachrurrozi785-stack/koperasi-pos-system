const express = require('express');
const { getSalesReport, getProfitLossReport, getBalanceSheet, getSHUReport } = require('../controllers/reportController');
const { authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/sales', authorize(['admin']), getSalesReport);
router.get('/profit-loss', authorize(['admin']), getProfitLossReport);
router.get('/balance-sheet', authorize(['admin']), getBalanceSheet);
router.get('/shu', authorize(['admin']), getSHUReport);

module.exports = router;
