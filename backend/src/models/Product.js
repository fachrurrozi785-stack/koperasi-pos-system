const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  barcode: {
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  priceCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  priceRetail: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  priceMember: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  minimumStock: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Product;
