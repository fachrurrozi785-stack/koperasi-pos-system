const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const transactionRoutes = require('./transactionRoutes');
const reportRoutes = require('./reportRoutes');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public Routes
router.use('/auth', authRoutes);

// Protected Routes
router.use('/users', authenticate, userRoutes);
router.use('/products', authenticate, productRoutes);
router.use('/transactions', authenticate, transactionRoutes);
router.use('/reports', authenticate, reportRoutes);

module.exports = router;
