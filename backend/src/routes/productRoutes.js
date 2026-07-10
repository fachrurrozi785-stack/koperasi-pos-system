const express = require('express');
const { getProducts, createProduct, updateProduct, deleteProduct, getProductByBarcode } = require('../controllers/productController');
const { authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/barcode/:barcode', getProductByBarcode);
router.post('/', authorize(['admin']), createProduct);
router.put('/:id', authorize(['admin']), updateProduct);
router.delete('/:id', authorize(['admin']), deleteProduct);

module.exports = router;
