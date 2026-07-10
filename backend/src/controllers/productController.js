const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductByBarcode = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { barcode: req.params.barcode } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    const product = await Product.findByPk(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductByBarcode, createProduct, updateProduct, deleteProduct };
