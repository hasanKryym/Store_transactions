const express = require('express');
const pool = require('../db/connect');
const router = express.Router();


router.route('/:type/:input').get( async (req, res) => {
    try {
        const { type, input } = req.params;
        if (type === 'customers'){
            const sortedList = await pool.query(`SELECT customer_id, customer_name FROM ${type} WHERE customer_name LIKE '${input}%'` )
            return res.status(200).json(sortedList.rows)
        } else if (type === 'products') {
            const sortedList = await pool.query(`SELECT product_id, product_name FROM ${type} WHERE product_name LIKE '${input}%'` )
            return res.status(200).json(sortedList.rows)
        } else if (type === 'customer_address'){
            const sortedList = await pool.query(`SELECT DISTINCT customer_id, customer_address FROM customers WHERE customer_address LIKE '${input}%'` )
            return res.status(200).json(sortedList.rows)
        } else {
            return res.status(404).json({success:false, msg:'err'})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
})

module.exports = router;