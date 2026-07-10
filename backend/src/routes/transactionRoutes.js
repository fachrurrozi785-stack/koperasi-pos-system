const express = require('express');
const { createTransaction, getTransactions, getTransactionDetail, voidTransaction } = require('../controllers/transactionController');
const { authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/:id', getTransactionDetail);
router.post('/:id/void', authorize(['admin']), voidTransaction);

module.exports = router;
