const pool = require('../db/connect');


const getCustomersFiltered = async (req, res) => {
    try {
        const {filterArray} = req.body;

        let customer_name = ''
        let customer_address = ''

        filterArray.map(({inputType, value}) => {
            if (inputType === 'customer_name')
                customer_name = value;
            if (inputType === 'customer_address')
                customer_address = value;
        });

        const customers = await pool.query(`SELECT * FROM customers ${customer_name && `WHERE customer_name LIKE '${customer_name}%'`} ${customer_name && customer_address && 'AND'} ${customer_address && !customer_name && 'WHERE'} ${customer_address && `customer_address LIKE '${customer_address}%' `}`)

        res.status(200).json(customers.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});   
    }
}

const getProductsFiltered = async (req, res) => {
    try {
        const { filterArray } = req.body;   
        let product_name = ''

        filterArray.map(({inputType, value}) => {
            if (inputType === 'product_name')
                product_name = value;
        });

        const products = await pool.query(`SELECT * FROM products WHERE product_name LIKE '${product_name}%'`);
        res.status(200).json(products.rows);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});   
    }
}

const getTransactionsFiltered = async (req, res) => {
    try {
        const { filterArray } = req.body;   
        // console.log(filterArray);
        let customer_name = ''
        let customer_address = ''
        let product_name = ''


        filterArray.map(({inputType, value}) => {
            if (inputType === 'customer_name')
                customer_name = value;
            if (inputType === 'customer_address')
                customer_address = value;
            if (inputType === 'product_name')
                product_name = value;
        });
        
        const transactions = await pool.query(`SELECT * FROM transactions ${customer_name && customer_address && !product_name && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_name LIKE '${customer_name}%' AND customer_address LIKE '${customer_address}%' )`} ${customer_name && !customer_address && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_name LIKE '${customer_name}%')`} ${customer_address && !customer_name && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_address LIKE '${customer_address}%')`} ${customer_name && customer_address && product_name && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_name LIKE '${customer_name}%' AND customer_address LIKE '${customer_address}%' ) AND product_id IN (SELECT product_id FROM products WHERE product_name LIKE '${product_name}%')`}`)
        let transactionInfo = [];

        const myPromise = new Promise((resolve, reject) => {

            transactions.rows.map( async (transaction, index) => {
            const adminInfo = await pool.query("SELECT admin_name, admin_email FROM admin WHERE admin_id = $1",[transaction.admin_id]);
            const admin_name = adminInfo.rows[0].admin_name;
            const admin_email = adminInfo.rows[0].admin_email;

            const customerInfo = await pool.query("SELECT customer_name, customer_email FROM customers WHERE customer_id = $1", [transaction.customer_id]);

            const customer_name = customerInfo.rows[0].customer_name;
            const customer_email = customerInfo.rows[0].customer_email;

            const productInfo = await pool.query("SELECT product_name FROM products WHERE product_id = $1", [transaction.product_id]);

            const product_name = productInfo.rows[0].product_name;

            const product_quantity = transaction.product_quantity;
            const transaction_id = transaction.transaction_id;
            const transaction_date = transaction.transaction_date;
            const customer_price = transaction.customer_price;
            
            const newTransaction = {
                admin_name,
                admin_email,
                customer_name,
                customer_email,
                product_name,
                product_quantity,
                transaction_date,
                transaction_id,
                customer_price
            }

            transactionInfo.push(newTransaction);
            if (transactions.rows[index+1] === undefined)
            resolve();
        })
    });
    
    myPromise.then(() => res.status(200).json(transactionInfo)).catch(err => console.log(err))

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

const getDraftsFiltered = async (req, res) => {
    try {
        const { filterArray } = req.body;   
        // console.log(filterArray);
        let customer_name = ''
        let customer_address = ''
        let product_name = ''


        filterArray.map(({inputType, value}) => {
            if (inputType === 'customer_name')
                customer_name = value;
            if (inputType === 'customer_address')
                customer_address = value;
            if (inputType === 'product_name')
                product_name = value;
        });
        
        const transactions = await pool.query(`SELECT * FROM transactions_draft ${customer_name && customer_address && !product_name && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_name LIKE '${customer_name}%' AND customer_address LIKE '${customer_address}%' )`} ${customer_name && !customer_address && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_name LIKE '${customer_name}%')`} ${customer_address && !customer_name && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_address LIKE '${customer_address}%')`} ${customer_name && customer_address && product_name && `WHERE customer_id IN (SELECT customer_id FROM customers WHERE customer_name LIKE '${customer_name}%' AND customer_address LIKE '${customer_address}%' ) AND product_id IN (SELECT product_id FROM products WHERE product_name LIKE '${product_name}%')`}`)
        let transactionInfo = [];

        const myPromise = new Promise((resolve, reject) => {

            transactions.rows.map( async (transaction, index) => {
            const adminInfo = await pool.query("SELECT admin_name, admin_email FROM admin WHERE admin_id = $1",[transaction.admin_id]);
            const admin_name = adminInfo.rows[0].admin_name;
            const admin_email = adminInfo.rows[0].admin_email;

            const customerInfo = await pool.query("SELECT customer_name, customer_email FROM customers WHERE customer_id = $1", [transaction.customer_id]);

            const customer_name = customerInfo.rows[0].customer_name;
            const customer_email = customerInfo.rows[0].customer_email;

            const productInfo = await pool.query("SELECT product_name FROM products WHERE product_id = $1", [transaction.product_id]);

            const product_name = productInfo.rows[0].product_name;

            const product_quantity = transaction.product_quantity;
            const transaction_id = transaction.transaction_id;
            const transaction_date = transaction.transaction_date;
            const customer_price = transaction.customer_price;
            
            const newTransaction = {
                admin_name,
                admin_email,
                customer_name,
                customer_email,
                product_name,
                product_quantity,
                transaction_date,
                transaction_id,
                customer_price
            }

            transactionInfo.push(newTransaction);
            if (transactions.rows[index+1] === undefined)
            resolve();
        })
    });
    
    myPromise.then(() => res.status(200).json(transactionInfo)).catch(err => console.log(err))

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

module.exports = {
    getTransactionsFiltered,
    getCustomersFiltered,
    getProductsFiltered,
    getDraftsFiltered
}