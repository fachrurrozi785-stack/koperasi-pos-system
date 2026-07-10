const Transaction = require('../models/Transaction');
const TransactionItem = require('../models/TransactionItem');
const Journal = require('../models/Journal');
const JournalDetail = require('../models/JournalDetail');
const Product = require('../models/Product');

const createTransaction = async (req, res) => {
  try {
    const { items, discount, paymentMethod, memberId } = req.body;
    
    // Generate transaction number
    const transactionNumber = `TRX-${Date.now()}`;
    
    // Calculate totals
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.subtotal;
    });
    
    const discountAmount = discount || 0;
    const taxAmount = (subtotal - discountAmount) * 0.1; // 10% PPN
    const total = subtotal - discountAmount + taxAmount;
    
    // Create transaction
    const transaction = await Transaction.create({
      transactionNumber,
      userId: req.user.userId,
      memberId,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paymentMethod,
      paymentStatus: 'completed'
    });
    
    // Create transaction items
    for (const item of items) {
      await TransactionItem.create({
        transactionId: transaction.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      });
      
      // Update stock
      const product = await Product.findByPk(item.productId);
      await product.update({ stock: product.stock - item.quantity });
    }
    
    // Create journal entry
    const journal = await Journal.create({
      journalNumber: `JNL-${Date.now()}`,
      referenceType: 'transaction',
      referenceId: transaction.id,
      description: `Penjualan ${transactionNumber}`
    });
    
    // Debit Kas/Piutang
    await JournalDetail.create({
      journalId: journal.id,
      accountCode: '1010', // Kas
      debit: total
    });
    
    // Credit Pendapatan Penjualan
    await JournalDetail.create({
      journalId: journal.id,
      accountCode: '4010', // Pendapatan Penjualan
      credit: subtotal
    });
    
    // Credit Pajak Penjualan (PPN)
    await JournalDetail.create({
      journalId: journal.id,
      accountCode: '2010', // Utang PPN
      credit: taxAmount
    });
    
    res.status(201).json({
      success: true,
      data: { transaction, items }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTransactionDetail = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    const items = await TransactionItem.findAll({ where: { transactionId: req.params.id } });
    res.json({ success: true, data: { transaction, items } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const voidTransaction = async (req, res) => {
  try {
    await Transaction.update({ isVoid: true }, { where: { id: req.params.id } });
    res.json({ success: true, message: 'Transaction voided' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTransaction, getTransactions, getTransactionDetail, voidTransaction };
