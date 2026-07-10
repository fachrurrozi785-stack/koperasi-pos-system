const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JournalDetail = sequelize.define('JournalDetail', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  journalId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  accountCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  debit: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0
  },
  credit: {
    type: DataTypes.DECIMAL(14, 2),
    defaultValue: 0
  },
  description: DataTypes.TEXT
}, {
  timestamps: true
});

module.exports = JournalDetail;
