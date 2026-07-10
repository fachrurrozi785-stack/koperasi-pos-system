const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  journalNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  referenceType: {
    type: DataTypes.ENUM('transaction', 'expense', 'adjustment'),
    allowNull: false
  },
  referenceId: DataTypes.UUID,
  description: DataTypes.TEXT,
  journalDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = Journal;
