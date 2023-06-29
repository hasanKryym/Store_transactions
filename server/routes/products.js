const express = require('express');
const { getProducts, addProduct, updateProduct, deleteProducts, deleteById } = require('../controllers/products');
const router = express.Router();


router.route('/').get(getProducts).post(addProduct).delete(deleteProducts)
router.route('/:id').patch(updateProduct).delete(deleteById)

module.exports = router;