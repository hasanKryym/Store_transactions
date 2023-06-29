const express = require('express');
const router = express.Router();

const {getCustomers, addCustomer, updateCustomer, deleteCustomers, deleteById} = require('../controllers/customers')

router.route('/').get(getCustomers).post(addCustomer).delete(deleteCustomers);
router.route('/:id').patch(updateCustomer).delete(deleteById)


module.exports = router;