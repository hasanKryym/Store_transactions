const pool = require('../db/connect');

const getCustomers = async (req, res) => {
    try {
        const customers = await pool.query('SELECT * FROM customers ORDER BY customer_name');
        res.status(200).json(customers.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

const addCustomer = async (req, res) => {

    try {
        const {customer_name, customer_email, customer_address, customer_number} = req.body;

        const email = await pool.query('SELECT customer_id FROM customers WHERE customer_email = $1', [customer_email]);

        if (email.rows.length === 0) {
            const add = await pool.query('INSERT INTO customers (customer_name, customer_email, customer_address, customer_number) VALUES ($1, $2, $3, $4)',[customer_name, customer_email, customer_address, customer_number]);
    
            return res.status(201).json({success: true, msg:'customer added successfully'});
        }else {
            return res.status(403).json({success: false, msg:'email already exists'});
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }

}

const updateCustomer = async (req, res) => {
    try {
        const {id: customer_id} = req.params;
    
        const {customer_name, customer_address, customer_number} = req.body;
        console.log(customer_id, customer_name, customer_address, customer_number);
        if (customer_id && customer_name && customer_address && customer_number){
            const customer = await pool.query("SELECT customer_id from customers WHERE customer_id = $1",[customer_id]);
        
            if (customer.rows.length !== 0) {
                const update = await pool.query("UPDATE customers SET customer_name = $1, customer_address = $2, customer_number = $3 WHERE customer_id = $4 ", [customer_name, customer_address, customer_number, customer_id]);
    
                return res.status(200).json({success: true, msg: 'customer updated successfully'});
            }
            return res.status(404).json({success: false, msg: 'customer doesnot exists'});
        }
        else {
            return res.status(404).json({success: false, msg: 'provide customer data'});
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

const deleteCustomers = async (req, res) => {
    try {
        const { customersId } = req.body;
        customersId.map( async (customerId) => {
            const erase = await pool.query("DELETE FROM customers WHERE customer_id = $1", [customerId]);
        });
        return res.status(200).json({success: true});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}

const deleteById = async (req, res) => {
    try {
        const { id: customer_id } = req.params;
        const erase = await pool.query("DELETE FROM customers WHERE customer_id = $1", [customer_id]);
        return res.status(200).json({success: true});

    } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: 'Error'});
    }
}


module.exports = {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomers,
    deleteById
}