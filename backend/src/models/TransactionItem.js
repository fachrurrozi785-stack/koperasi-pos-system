const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransactionItem = sequelize.define('TransactionItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(14, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = TransactionItem;
