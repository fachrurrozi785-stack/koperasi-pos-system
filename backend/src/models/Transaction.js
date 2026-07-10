const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  memberId: DataTypes.UUID,
  subtotal: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'qris', 'debit', 'credit', 'potong_simpanan'),
    defaultValue: 'cash'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: DataTypes.TEXT,
  isVoid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Transaction;
