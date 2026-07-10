const { sequelize } = require('../config/database');
const Transaction = require('../models/Transaction');
const TransactionItem = require('../models/TransactionItem');
const JournalDetail = require('../models/JournalDetail');

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await Transaction.findAll({
      where: {
        createdAt: {
          [sequelize.Op.between]: [new Date(startDate), new Date(endDate)]
        },
        isVoid: false
      }
    });
    
    const totalSales = transactions.reduce((sum, t) => sum + parseFloat(t.total), 0);
    res.json({ success: true, data: { transactions, totalSales } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfitLossReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Query pendapatan
    const revenue = await JournalDetail.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('credit')), 'total']],
      where: { accountCode: '4010' }
    });
    
    // Query beban
    const expenses = await JournalDetail.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('debit')), 'total']],
      where: { accountCode: { [sequelize.Op.like]: '6%' } }
    });
    
    const profitLoss = (revenue[0]?.dataValues?.total || 0) - (expenses[0]?.dataValues?.total || 0);
    
    res.json({ success: true, data: { revenue: revenue[0]?.dataValues, expenses: expenses[0]?.dataValues, profitLoss } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBalanceSheet = async (req, res) => {
  try {
    // Query aset
    const assets = await JournalDetail.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('debit')), 'total']],
      where: { accountCode: { [sequelize.Op.like]: '1%' } }
    });
    
    // Query utang
    const liabilities = await JournalDetail.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('credit')), 'total']],
      where: { accountCode: { [sequelize.Op.like]: '2%' } }
    });
    
    // Query ekuitas
    const equity = await JournalDetail.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('credit')), 'total']],
      where: { accountCode: { [sequelize.Op.like]: '3%' } }
    });
    
    res.json({ success: true, data: { assets: assets[0]?.dataValues, liabilities: liabilities[0]?.dataValues, equity: equity[0]?.dataValues } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSHUReport = async (req, res) => {
  try {
    res.json({ success: true, message: 'SHU Report' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSalesReport, getProfitLossReport, getBalanceSheet, getSHUReport };
