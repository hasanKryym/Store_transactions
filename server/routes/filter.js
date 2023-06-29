const express = require('express');
const { getTransactionsFiltered, getCustomersFiltered, getProductsFiltered, getDraftsFiltered } = require('../controllers/filter');
const router = express.Router();


router.route('/transactions').post(getTransactionsFiltered)
router.route('/transactions_draft').post(getDraftsFiltered)
router.route('/customers').post(getCustomersFiltered)
router.route('/products').post(getProductsFiltered)

module.exports = router;